import React, { useState, useEffect } from "react";
import { 
  Box, Heading, Button, VStack, Text, Spinner, 
  useToast, Input, FormControl, FormLabel, Textarea, HStack 
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const StoragePage = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedComment, setEditedComment] = useState("");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
    fetchFiles();
  }, [accessToken, navigate]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/storage/files/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setFiles(response.data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить файлы",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/storage/files/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast({ title: "Файл загружен", status: "success", duration: 3000, isClosable: true });
      fetchFiles();
    } catch (error) {
      toast({ title: "Ошибка загрузки", description: error.response?.data?.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/storage/files/${fileId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast({ title: "Файл удалён", status: "success", duration: 3000, isClosable: true });
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      toast({ title: "Ошибка удаления", status: "error", duration: 3000, isClosable: true });
    }
  };

  const startEditing = (file) => {
    setEditingFile(file);
    setEditedName(file.name);
    setEditedComment(file.comment || "");
  };

  const cancelEditing = () => {
    setEditingFile(null);
    setEditedName("");
    setEditedComment("");
  };

  const saveChanges = async () => {
    if (!editingFile) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/storage/files/${editingFile.id}/`,
        { name: editedName, comment: editedComment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      toast({ title: "Файл обновлён", status: "success", duration: 3000, isClosable: true });
      fetchFiles();
      cancelEditing();
    } catch (error) {
      toast({ title: "Ошибка обновления", status: "error", duration: 3000, isClosable: true });
    }
  };

  const formatSize = (size) => {
    if (size < 1024) return `${size} Б`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} КБ`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} МБ`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} ГБ`;
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <VStack spacing={6} mt={10} align="center">
      <Heading size="xl">Мои файлы</Heading>

      {/* Отображение общего объема */}
      <Text fontSize="lg" fontWeight="bold">
        Общий объем файлов: {formatSize(totalSize)}
      </Text>

      <FormControl>
        <FormLabel>Выберите файл</FormLabel>
        <Input type="file" onChange={handleFileChange} />
        <Button colorScheme="blue" onClick={uploadFile} isLoading={uploading} mt={2}>
          Загрузить
        </Button>
      </FormControl>

      {loading ? (
        <Spinner size="xl" />
      ) : files.length === 0 ? (
        <Text>Файлы отсутствуют</Text>
      ) : (
        <VStack spacing={4} w="80%">
          {files.map((file) => (
            <Box key={file.id} p={4} shadow="md" borderWidth="1px" borderRadius="lg" w="100%">
              {editingFile && editingFile.id === file.id ? (
                <>
                  <FormControl>
                    <FormLabel>Название</FormLabel>
                    <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Комментарий</FormLabel>
                    <Textarea value={editedComment} onChange={(e) => setEditedComment(e.target.value)} />
                  </FormControl>
                  <HStack mt={2}>
                    <Button colorScheme="green" onClick={saveChanges}>Сохранить</Button>
                    <Button colorScheme="red" onClick={cancelEditing}>Отмена</Button>
                  </HStack>
                </>
              ) : (
                <>
                  <Text fontSize="lg"><strong>Название:</strong> {file.name}</Text>
                  <Text fontSize="sm"><strong>Размер:</strong> {formatSize(file.size)}</Text>
                  <Text fontSize="sm"><strong>Дата загрузки:</strong> {new Date(file.published).toLocaleString()}</Text>
                  <HStack mt={2}>
                    <Button colorScheme="blue" size="sm" onClick={() => window.open(`${import.meta.env.VITE_API_URL}/storage/files/${file.id}/download/`, "_blank")}>
                      Скачать
                    </Button>
                    <Button colorScheme="yellow" size="sm" onClick={() => startEditing(file)}>Редактировать</Button>
                    <Button colorScheme="red" size="sm" onClick={() => deleteFile(file.id)}>Удалить</Button>
                  </HStack>
                </>
              )}
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default StoragePage;
