from rest_framework import serializers
from .models import Takvim, Event, User
import icecream


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'takvim', 'name', 'term', 'start_date', 'end_date']


class TakvimSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = Takvim
        fields = ['id', 'name', 'year', 'events']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name','password']



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        try:
            icecream.ic(username, password)
            user = User.objects.get(username=username)
            icecream.ic(user.username, user.first_name, user.password, user.pk)

        except User.DoesNotExist:
            raise serializers.ValidationError("Geçersiz kullanıcı adı veya şifre.")

        icecream.ic(password)
        if not user.check_password(password):
            raise serializers.ValidationError("Geçersiz kullanıcı adı veya şifre.")

        return user

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50, required=True)
    first_name = serializers.CharField(max_length=50, required=True)
    last_name = serializers.CharField(max_length=50, required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Bu kullanıcı adı zaten alınmış.")

        return data

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )

        from rest_framework_simplejwt.tokens import RefreshToken

        token = RefreshToken.for_user(user)

        return {
            'user': user,
            'token': {
                'refresh': str(token),
                'access': str(token.access_token)
            }
        }



