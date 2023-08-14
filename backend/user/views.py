from django.core.exceptions import ObjectDoesNotExist
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView

from user.models import CfUser
from user.serializers import CfUserSerializer, CfUserDetailSerializer


class CfUserRetrieveView(RetrieveAPIView):
    queryset = CfUser.objects.all()
    serializer_class = CfUserDetailSerializer

    def get_object(self):
        username = self.kwargs["username"]
        try:
            return CfUser.objects.get(username__iexact=username)
        except ObjectDoesNotExist:
            pass


class CfUserUpdateView(UpdateAPIView):
    queryset = CfUser.objects.all()
    serializer_class = CfUserSerializer
    lookup_field = "username"


class CfUserListView(ListAPIView):
    queryset = CfUser.objects.all()
    serializer_class = CfUserSerializer
