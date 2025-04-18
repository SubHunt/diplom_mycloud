# from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from . import views


# urlpatterns = [
#     # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/', views.CustomTokenObtainPairView.as_view(),
#          name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('admin/users/', views.AdminUserListView.as_view(), name='admin-user-list'),
#     path('admin/', views.AdminUserListView.as_view(), name='admin-user-list'),
#     path('admin/users/<int:pk>/', views.AdminUserDetailView.as_view(),
#          name='admin-user-detail'),
#     path('admin/users/<int:user_id>/',
#          views.AdminDeleteUserView.as_view(), name='admin_user_delete'),
#     path('register/', views.RegisterView.as_view(), name='register'),
#     path('user/', views.CurrentUserView.as_view(), name='current-user'),
# ]

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('token/', views.CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/users/', views.AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:pk>/', views.AdminUserDetailView.as_view(),
         name='admin-user-detail'),
    path('admin/users/<int:pk>/', views.AdminDeleteUserView.as_view(),
         name='admin_user_delete'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('user/', views.CurrentUserView.as_view(), name='current-user'),
]
