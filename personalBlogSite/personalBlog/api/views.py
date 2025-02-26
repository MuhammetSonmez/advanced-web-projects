import icecream
from django.contrib.admin.utils import lookup_field
from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from rest_framework import viewsets
from unicodedata import category
from .models import User, Category, Blog, Comment
from .serializers import UserSerializer, CategorySerializer, BlogSerializer, CommentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from .serializers import LoginSerializer, RegisterSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
import jwt
from personalBlog.settings import SECRET_KEY
from django.views import View

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            access_token = str(AccessToken.for_user(user))
            return Response({
                'access': access_token,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryView(APIView):

    def post(self, request, *args, **kwargs):
        jwt_token = request.headers.get("Authorization")
        if not jwt_token or not jwt_token.startswith("Bearer: "):
            return Response({"error": "Authorization header must contain a Bearer token."}, status=status.HTTP_401_UNAUTHORIZED)

        jwt_token = jwt_token.split(" ")[1]
        icecream.ic(jwt_token)
        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            icecream.ic(payload)
            user_id = payload.get("user_id")
            icecream.ic(user_id)
        except jwt.ExpiredSignatureError:
            return Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid JWT token"}, status=status.HTTP_401_UNAUTHORIZED)

        from .models import User
        user = User.objects.get(id=user_id)
        icecream.ic(user.role)

        if user.role != "Mod":
            return Response({"error": "Bu işlem için yetkiniz yok."}, status=status.HTTP_403_FORBIDDEN)

        category_name = request.data.get("category_name")
        if not category_name:
            return Response({"error": "category_name alanı gereklidir."}, status=status.HTTP_400_BAD_REQUEST)

        category = Category.objects.create(category_name=category_name)
        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if pk:
            try:
                category = Category.objects.get(id=pk)
                serializer = CategorySerializer(category)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Category.DoesNotExist:
                return Response({"error": "Kategori bulunamadı"}, status=status.HTTP_404_NOT_FOUND)
        else:
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        jwt_token = request.headers.get("Authorization")
        if not jwt_token or not jwt_token.startswith("Bearer: "):
            return Response({"error": "Authorization header must contain a Bearer token."}, status=status.HTTP_401_UNAUTHORIZED)

        jwt_token = jwt_token.split(" ")[1]
        category_id = request.data.get("category_id")
        category_name = request.data.get("category_name")

        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid JWT token"}, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.get(id=user_id)
        if user.role != "Mod":
            return Response({"error": "Bu işlem için yetkiniz yok."}, status=status.HTTP_403_FORBIDDEN)

        if not category_id or not category_name:
            return Response({"error": "category_id ve category_name alanları gereklidir."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            category = Category.objects.get(id=category_id)
            category.category_name = category_name
            category.save()
            serializer = CategorySerializer(category)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Category.DoesNotExist:
            return Response({"error": "Kategoriyi bulamadım."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        jwt_token = request.headers.get("Authorization")
        if not jwt_token or not jwt_token.startswith("Bearer: "):
            return Response({"error": "Authorization header must contain a Bearer token."}, status=status.HTTP_401_UNAUTHORIZED)

        jwt_token = jwt_token.split(" ")[1]
        category_id = request.data.get("category_id")

        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid JWT token"}, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.get(id=user_id)
        if user.role != "Mod":
            return Response({"error": "Bu işlem için yetkiniz yok."}, status=status.HTTP_403_FORBIDDEN)

        if not category_id:
            return Response({"error": "category_id alanı gereklidir."}, status=status.HTTP_400_BAD_REQUEST)

        if Blog.objects.filter(category_id=category_id).exists():
            return Response({"error": "Bu kategoriye ait bloglar olduğu için silinemez."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            category = Category.objects.get(id=category_id)
            category.delete()
            return Response({"message": "Kategori başarıyla silindi."}, status=status.HTTP_204_NO_CONTENT)
        except Category.DoesNotExist:
            return Response({"error": "Kategoriyi bulamadım."}, status=status.HTTP_404_NOT_FOUND)

class BlogView(APIView):

    def post(self, request, *args, **kwargs):
        icecream.ic("checkpoint1")

        jwt_token = request.headers.get("Authorization")
        icecream.ic(request)
        if not jwt_token or not jwt_token.startswith("Bearer: "):
            icecream.ic("test")
            return Response({"error": "Authorization header must contain a Bearer token."},
                            status=status.HTTP_401_UNAUTHORIZED)

        jwt_token = jwt_token.split(" ")[1]
        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid JWT token"}, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.get(id=user_id)

        if user.role != "Mod":
            return Response({"error": "Bu işlem için yetkiniz yok."}, status=status.HTTP_403_FORBIDDEN)

        title = request.data.get('title')
        content = request.data.get('content')
        photo = request.FILES.get('photo')
        category_id = request.data.get('category')
        icecream.ic(category_id)
        try:
            category = Category.objects.get(id=category_id)
            category_id = category.id
        except Category.DoesNotExist:
            return Response({"error": "Kategori bulunamadı"}, status=status.HTTP_404_NOT_FOUND)

        blog_data = {
            "user_id": user_id,
            "title": title,
            "content": content,
            "photo": photo,
            "category": category_id
        }
        icecream.ic(blog_data)

        serializer = BlogSerializer(data=blog_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None):
        if pk:
            try:
                blog = Blog.objects.get(id=pk)
                blog.title = blog.title.upper()
                serializer = BlogSerializer(blog)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Blog.DoesNotExist:
                return Response({"error": "Blog bulunamadı"}, status=status.HTTP_404_NOT_FOUND)

        elif request.query_params.get('category_id') != None:
            category_id = request.query_params.get('category_id')
            icecream.ic(category_id)
            try:
                category = Category.objects.get(id=category_id)
                icecream.ic(category.id)
                blogs = Blog.objects.filter(category_id=category.id)
                serializer = BlogSerializer(blogs, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Blog.DoesNotExist:
                return Response({"error": "Blog bulunamadı"}, status=status.HTTP_404_NOT_FOUND)
        else:
            blogs = Blog.objects.all()
            serializer = BlogSerializer(blogs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        jwt_token = request.headers.get("Authorization")
        if not jwt_token or not jwt_token.startswith("Bearer: "):
            return Response({"error": "Authorization header must contain a Bearer token."},
                            status=status.HTTP_401_UNAUTHORIZED)

        jwt_token = jwt_token.split(" ")[1]
        blog_id = request.data.get("blog_id")
        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid JWT token"}, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.get(id=user_id)

        if user.role != "Mod":
            return Response({"error": "Bu işlem için yetkiniz yok."}, status=status.HTTP_403_FORBIDDEN)

        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog bulunamadı"}, status=status.HTTP_404_NOT_FOUND)

        title = request.data.get('title', blog.title)
        content = request.data.get('content', blog.content)
        photo = request.FILES.get('photo', blog.photo)
        category_id = request.data.get('category', blog.category.id)
        try:
            icecream.ic(Category.objects.all())
            category = Category.objects.get(id=category_id)
            category_id = category.id
        except Category.DoesNotExist:
            return Response({"error": "Kategori bulunamadı"}, status=status.HTTP_404_NOT_FOUND)


        blog_data = {
            "user_id": user_id,
            "title": title,
            "content": content,
            "photo": photo,
            "category": category_id
        }


        serializer = BlogSerializer(blog, data=blog_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        jwt_token = request.headers.get("Authorization")
        if not jwt_token or not jwt_token.startswith("Bearer: "):
            return Response({"error": "Authorization header must contain a Bearer token."},
                            status=status.HTTP_401_UNAUTHORIZED)

        jwt_token = jwt_token.split(" ")[1]

        blog_id = request.data.get("blog_id")

        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid JWT token"}, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.get(id=user_id)
        if user.role != "Mod":
            return Response({"error": "Bu işlem için yetkiniz yok."}, status=status.HTTP_403_FORBIDDEN)

        if not blog_id:
            return Response({"error": "blog_id alanı gereklidir."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blog = Blog.objects.get(id=blog_id)
            blog.delete()
            return Response({"message": "Blog başarıyla silindi."}, status=status.HTTP_204_NO_CONTENT)
        except Blog.DoesNotExist:
            return Response({"error": "Blog bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

class CommentView(APIView):
    def post(self, request):
        jwt_token = request.headers.get("Authorization")
        if not jwt_token or not jwt_token.startswith("Bearer: "):
            return Response({"error": "Authorization header must contain a Bearer token."},
                            status=status.HTTP_401_UNAUTHORIZED)

        jwt_token = jwt_token.split(" ")[1]
        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid JWT token"}, status=status.HTTP_401_UNAUTHORIZED)



        comment_text = request.data.get('comment_text')
        blog_id = request.data.get('blog_id')

        try:
            Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog bulunamadı"}, status=status.HTTP_404_NOT_FOUND)

        comment_data = {
            "user_id": user_id,
            "comment_text": comment_text,
            "blog_id": blog_id
        }

        icecream.ic(blog_id)

        serializer = CommentSerializer(data=comment_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        blog_id = request.query_params.get('blog_id')
        icecream.ic("get triggered")
        icecream.ic(blog_id)
        if blog_id:
            icecream.ic("checkpoint1")
            blog = Blog.objects.get(id=blog_id)
            icecream.ic(blog)
            comments = Comment.objects.filter(blog_id=blog_id)
            icecream.ic(comments)
            if comments.exists():
                serializer = CommentSerializer(comments, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Yorum bulunamadı"}, status=status.HTTP_404_NOT_FOUND)
        else:
            icecream.ic("checkpoint2")
            comments = Comment.objects.all()
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        jwt_token = request.headers.get("Authorization")
        if not jwt_token or not jwt_token.startswith("Bearer: "):
            return Response({"error": "Authorization header must contain a Bearer token."},
                            status=status.HTTP_401_UNAUTHORIZED)

        jwt_token = jwt_token.split(" ")[1]
        comment_id = request.data.get("comment_id")
        comment_text = request.data.get("comment_text")

        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid JWT token"}, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.get(id=user_id)
        if user.role != "Mod":
            return Response({"error": "Bu işlem için yetkiniz yok."}, status=status.HTTP_403_FORBIDDEN)

        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return Response({"error": "Comment bulunamadı"}, status=status.HTTP_404_NOT_FOUND)

        if comment_text:
            comment.comment_text = comment_text
            comment.save()
            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "comment_text alanı gereklidir."}, status=status.HTTP_400_BAD_REQUEST)




    def delete(self, request, *args, **kwargs):
        jwt_token = request.headers.get("Authorization")
        if not jwt_token or not jwt_token.startswith("Bearer: "):
            return Response({"error": "Authorization header must contain a Bearer token."},
                            status=status.HTTP_401_UNAUTHORIZED)

        jwt_token = jwt_token.split(" ")[1]
        comment_id = request.data.get("comment_id")

        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid JWT token"}, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.get(id=user_id)
        if user.role != "Mod":
            return Response({"error": "Bu işlem için yetkiniz yok."}, status=status.HTTP_403_FORBIDDEN)

        if not comment_id:
            return Response({"error": "blog_id alanı gereklidir."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            comment = Comment.objects.get(id=comment_id)
            comment.delete()
            return Response({"message": "Blog başarıyla silindi."}, status=status.HTTP_204_NO_CONTENT)
        except Blog.DoesNotExist:
            return Response({"error": "Blog bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

class CheckUserView(APIView):
    def get(self, request):
        jwt_token = request.headers.get("Authorization")
        if not jwt_token or not jwt_token.startswith("Bearer: "):
            return Response({"error": "Authorization header must contain a Bearer token."},
                            status=status.HTTP_401_UNAUTHORIZED)

        jwt_token = jwt_token.split(" ")[1]

        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid JWT token"}, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.get(id=user_id)
        return Response({"ID":user.id, "Username": user.username, "Name": user.first_name, "Surname": user.last_name, "Email": user.email, "Role": user.role}, status=status.HTTP_200_OK)

class ChangePasswordView(APIView):

    def post(self, request):
        jwt_token = request.headers.get("Authorization")
        if not jwt_token or not jwt_token.startswith("Bearer: "):
            return Response({"error": "Authorization header must contain a Bearer token."},
                            status=status.HTTP_401_UNAUTHORIZED)

        jwt_token = jwt_token.split(" ")[1]
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid JWT token"}, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.get(id=user_id)

        if not user.check_password(old_password):
            return Response({"error": "Mevcut şifre doğru değil"}, status=status.HTTP_400_BAD_REQUEST)

        user.password = new_password
        user.save()

        return Response({"message": "Şifre başarıyla güncellendi"}, status=status.HTTP_200_OK)

class AddUserView(APIView):
    def post(self, request, *args, **kwargs):
        admin_password = "admin"
        provided_password = request.data.get("admin_password")
        icecream.ic(admin_password, provided_password)
        if provided_password != admin_password:
            return Response({"error": "Geçersiz şifre"}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Kullanıcı başarıyla oluşturuldu.", "user": serializer.data},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetUsernameView(APIView):
    def get(self, request, user_id, *args, **kwargs):
        try:
            user = User.objects.get(id=user_id)
            return Response({'username': user.username}, status=200)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

import os
from django.http import HttpResponse
from django.conf import settings
from markdown import markdown


def readme_view(request):
    readme_path = os.path.join(settings.BASE_DIR, "api.md")

    with open(readme_path, "r", encoding="utf-8") as f:
        readme_content = f.read()

    readme_html = markdown(readme_content, extensions=["fenced_code", "codehilite"])

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>README</title>
        <!-- GitHub Markdown CSS -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css">
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 20px;
                padding: 0;
                background-color: #f6f8fa;
            }}
            .markdown-body {{
                box-sizing: border-box;
                min-width: 200px;
                max-width: 980px;
                margin: 0 auto;
                padding: 45px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 6px;
            }}
        </style>
    </head>
    <body>
        <article class="markdown-body">
            {readme_html}
        </article>
    </body>
    </html>
    """

    return HttpResponse(html_content)







