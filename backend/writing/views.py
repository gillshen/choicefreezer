from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveUpdateDestroyAPIView,
)

from writing.models import UserLog
from writing.serializers import UserLogSerializer, UserLogListItemSerializer


class UserLogCreateView(CreateAPIView):
    queryset = UserLog.objects.all()
    serializer_class = UserLogSerializer


class UserLogUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = UserLog.objects.all()
    serializer_class = UserLogSerializer


class UserLogListView(ListAPIView):
    serializer_class = UserLogListItemSerializer

    def get_queryset(self):
        queryset = UserLog.objects.all()

        username = self.request.query_params.get("username")
        if username is not None:
            queryset = queryset.filter(author__username__iexact=username)

        public = self.request.query_params.get("public")
        if public == "true":
            queryset = queryset.filter(public=True)
        elif public == "false":
            queryset = queryset.filter(public=False)

        shared = self.request.query_params.get("shared")
        if shared == "true":
            queryset = queryset.filter(shared=True)
        elif shared == "false":
            queryset = queryset.filter(shared=False)

        student_id = self.request.query_params.get("student")
        if student_id is not None:
            queryset = queryset.filter(about_student=student_id)

        return queryset
