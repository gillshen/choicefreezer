from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveUpdateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from target.models import (
    School,
    SchoolRanking,
    Program,
    Target,
    TargetRequirements,
    SubTarget,
)

from target.serializers import (
    # Create, update, delete
    SchoolSerializer,
    SchoolRankingSerializer,
    ProgramSerializer,
    TargetSerializer,
    TargetRequirementsSerializer,
    SubTargetSerializer,
    # List items
    SchoolListItemSerializer,
    ProgramListItemSerializer,
    TargetListItemSerializer,
)


class SchoolCreateView(CreateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer


class SchoolUpdateView(RetrieveUpdateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer


class SchoolRankingCreateView(CreateAPIView):
    queryset = SchoolRanking.objects.all()
    serializer_class = SchoolRankingSerializer


class SchoolRankingUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = SchoolRanking.objects.all()
    serializer_class = SchoolRankingSerializer


class ProgramCreateView(CreateAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer


class ProgramUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer


class TargetCreateView(CreateAPIView):
    queryset = Target.objects.all()
    serializer_class = TargetSerializer


class TargetUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Target.objects.all()
    serializer_class = TargetSerializer


class TargetRequirementsCreateView(CreateAPIView):
    queryset = TargetRequirements.objects.all()
    serializer_class = TargetRequirementsSerializer


class TargetRequirementsUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = TargetRequirements.objects.all()
    serializer_class = TargetRequirementsSerializer


class SubTargetCreateView(CreateAPIView):
    queryset = SubTarget.objects.all()
    serializer_class = SubTargetSerializer


class SubTargetUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = SubTarget.objects.all()
    serializer_class = SubTargetSerializer


class SchoolListView(ListAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolListItemSerializer


class ProgramListView(ListAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramListItemSerializer


class TargetListView(ListAPIView):
    queryset = Target.objects.all()
    serializer_class = TargetListItemSerializer
