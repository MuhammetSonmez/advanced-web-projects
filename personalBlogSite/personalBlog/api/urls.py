from django.urls import path, include
from setuptools.extern import names
from django.http import JsonResponse
from .views import  LoginView, RegisterView, CategoryView, BlogView,CommentView, CheckUserView, ChangePasswordView, AddUserView,GetUsernameView,readme_view

def list_api_endpoints(request):
    api_patterns = [
        {'name': 'login', 'url': '/api/login/'},
        {'name': 'register', 'url': '/api/register/'},
        {'name': 'category', 'url': '/api/category/'},
        {'name': 'category-detail', 'url': '/api/category/<int:pk>/'},
        {'name': 'blog', 'url': '/api/blog/'},
        {'name': 'blog-detail', 'url': '/api/blog/<int:pk>/'},
        {'name': 'blog-detail', 'url': '/api/blog/?category_id=<string:category_id>'},
        {'name': 'comment', 'url': '/api/comment/'},
        {'name': 'comment-detail', 'url': '/api/comment/<int:pk>/'},
        {'name': 'comment-detail', "url": '/api/comment/?blog_id=<int:blog_id>'},
        {'name': 'check-user', 'url': '/api/check-user/'},
        {'name': 'change-password', 'url': '/api/change-password/'},
        {'name': 'admin', 'url': '/api/admin/'},
        {'name': 'readme', 'url': '/api/readme/'}

    ]
    return JsonResponse({'api_endpoints': api_patterns})



urlpatterns = [
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/category/', CategoryView.as_view(), name='category'),
    path('api/category/<int:pk>/', CategoryView.as_view(), name='category-detail'),
    path('api/blog/', BlogView.as_view(), name='blog'),
    path('api/blog/<int:pk>/', BlogView.as_view(), name='blog-detail'),
    path('api/comment/', CommentView.as_view(), name='comment'),
    path('api/comment/<int:pk>/', CommentView.as_view(), name='comment-detail'),
    path('api/check-user/', CheckUserView.as_view(), name='check-user'),
    path('api/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('api/admin/', AddUserView.as_view(), name='admin'),
    path("api/readme/", readme_view, name="readme"),
    path('api/user/<int:user_id>/username/', GetUsernameView.as_view(), name='get-username'),
    path('api/', list_api_endpoints, name='api-endpoints'),
]
