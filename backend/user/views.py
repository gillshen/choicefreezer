from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView

from user.models import UserProfile
from user.serializers import UserProfileSerializer, UserProfileListItemSerializer


class UserProfileUpdateView(RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class UserProfileListView(ListAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileListItemSerializer
