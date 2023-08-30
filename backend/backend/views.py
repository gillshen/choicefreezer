from user.models import CfUser

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CfTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: CfUser):
        token = super().get_token(user)
        token["username"] = user.username
        token["department"] = user.department
        return token


class CfTokenObtainPairView(TokenObtainPairView):
    serializer_class = CfTokenObtainPairSerializer
