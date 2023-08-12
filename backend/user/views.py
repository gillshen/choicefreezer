from django.core.exceptions import ObjectDoesNotExist
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView

from user.models import UserProfile
from user.serializers import UserProfileSerializer, UserProfileListItemSerializer


class UserProfileRetrieveView(RetrieveAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get_object(self):
        username = self.kwargs["username"]
        try:
            return UserProfile.objects.get(user__username__iexact=username)
        except ObjectDoesNotExist:
            pass


class UserProfileUpdateView(UpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class UserProfileListView(ListAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileListItemSerializer
