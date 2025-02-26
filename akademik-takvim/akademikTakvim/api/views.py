from rest_framework import generics
from .models import Takvim, Event, User
from .serializers import TakvimSerializer, EventSerializer, UserSerializer, LoginSerializer
import icecream
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import AccessToken
import jwt
from akademikTakvim.settings import SECRET_KEY


def auth(token):
    if not token:
        return Response({'error': 'Token sağlanmamış.'}, 401)

    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return Response({"error": "JWT token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.InvalidTokenError:
        return Response({"error": "Invalid JWT token"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        user_id = decoded_token.get('user_id')
        User.objects.get(id=user_id)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    return None




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


class TakvimListCreateView(generics.ListCreateAPIView):
    queryset = Takvim.objects.all()
    serializer_class = TakvimSerializer

    def post(self, request, *args, **kwargs):
        token = request.data.get('jwt_token')
        auth_response = auth(token)

        if auth_response:
            return auth_response
        return super().post(request, *args, **kwargs)


class TakvimDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Takvim.objects.all()
    serializer_class = TakvimSerializer

    def put(self, request, *args, **kwargs):
        token = request.data.get('jwt_token')
        auth_response = auth(token)

        if auth_response:
            return auth_response
        return super().put(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        token = request.data.get('jwt_token')
        icecream.ic(token)
        auth_response = auth(token)

        if auth_response:
            return auth_response
        return super().delete(request, *args, **kwargs)


class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def post(self, request, *args, **kwargs):
        token = request.data.get('jwt_token')
        auth_response = auth(token)

        if auth_response:
            return auth_response
        return super().post(request, *args, **kwargs)


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def put(self, request, *args, **kwargs):
        token = request.data.get('jwt_token')
        auth_response = auth(token)

        if auth_response:
            return auth_response

        return super().put(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        token = request.data.get('jwt_token')
        auth_response = auth(token)

        if auth_response:
            return auth_response
        return super().delete(request, *args, **kwargs)
