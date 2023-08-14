from django.core.exceptions import ObjectDoesNotExist
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)

from user.models import CfUser
from user.serializers import (
    CfUserCreateUpdateSerializer,
    CfUserRetrieveSerializer,
    CfUserListItemSerializer,
)


class CfUserCreateView(CreateAPIView):
    queryset = CfUser.objects.all()
    serializer_class = CfUserCreateUpdateSerializer


class CfUserRetrieveView(RetrieveAPIView):
    queryset = CfUser.objects.all()
    serializer_class = CfUserRetrieveSerializer

    def get_object(self):
        username = self.kwargs["username"]
        try:
            return CfUser.objects.get(username__iexact=username)
        except ObjectDoesNotExist:
            pass


class CfUserUpdateView(UpdateAPIView):
    queryset = CfUser.objects.all()
    serializer_class = CfUserCreateUpdateSerializer
    lookup_field = "username"


class CfUserListView(ListAPIView):
    queryset = CfUser.objects.all()
    serializer_class = CfUserListItemSerializer
