from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveUpdateDestroyAPIView,
)

from student.models import (
    StudentLog,
    Enrollment,
    GPA,
    ClassRank,
    TOEFL,
    IELTS,
    DET,
    SAT,
    ACT,
    AP,
    GRE,
)

from student.serializers import (
    StudentLogSerializer,
    EnrollmentSerializer,
    GPA_Serializer,
    ClassRankSerializer,
    TOEFL_Serializer,
    IELTS_Serializer,
    DET_Serializer,
    SAT_Serializer,
    ACT_Serializer,
    AP_Serializer,
    GRE_Serializer,
)


class StudentLogCreateView(CreateAPIView):
    queryset = StudentLog.objects.all()
    serializer_class = StudentLogSerializer


class StudentLogUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = StudentLog.objects.all()
    serializer_class = StudentLogSerializer


class StudentLogListView(ListAPIView):
    queryset = StudentLog.objects.all()
    serializer_class = StudentLogSerializer


class EnrollmentCreateView(CreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer


class EnrollmentUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer


class EnrollmentListView(ListAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer


class GPA_CreateView(CreateAPIView):
    queryset = GPA.objects.all()
    serializer_class = GPA_Serializer


class GPA_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = GPA.objects.all()
    serializer_class = GPA_Serializer


class GPA_ListView(ListAPIView):
    queryset = GPA.objects.all()
    serializer_class = GPA_Serializer


class ClassRankCreateView(CreateAPIView):
    queryset = ClassRank.objects.all()
    serializer_class = ClassRankSerializer


class ClassRankUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = ClassRank.objects.all()
    serializer_class = ClassRankSerializer


class ClassRankListView(ListAPIView):
    queryset = ClassRank.objects.all()
    serializer_class = ClassRankSerializer


class TOEFL_CreateView(CreateAPIView):
    queryset = TOEFL.objects.all()
    serializer_class = TOEFL_Serializer


class TOEFL_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = TOEFL.objects.all()
    serializer_class = TOEFL_Serializer


class TOEFL_ListView(ListAPIView):
    queryset = TOEFL.objects.all()
    serializer_class = TOEFL_Serializer


class IELTS_CreateView(CreateAPIView):
    queryset = IELTS.objects.all()
    serializer_class = IELTS_Serializer


class IELTS_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = IELTS.objects.all()
    serializer_class = IELTS_Serializer


class IELTS_ListView(ListAPIView):
    queryset = IELTS.objects.all()
    serializer_class = IELTS_Serializer


class DET_CreateView(CreateAPIView):
    queryset = DET.objects.all()
    serializer_class = DET_Serializer


class DET_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = DET.objects.all()
    serializer_class = DET_Serializer


class DET_ListView(ListAPIView):
    queryset = DET.objects.all()
    serializer_class = DET_Serializer


class SAT_CreateView(CreateAPIView):
    queryset = SAT.objects.all()
    serializer_class = SAT_Serializer


class SAT_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = SAT.objects.all()
    serializer_class = SAT_Serializer


class SAT_ListView(ListAPIView):
    queryset = SAT.objects.all()
    serializer_class = SAT_Serializer


class ACT_CreateView(CreateAPIView):
    queryset = ACT.objects.all()
    serializer_class = ACT_Serializer


class ACT_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = ACT.objects.all()
    serializer_class = ACT_Serializer


class ACT_ListView(ListAPIView):
    queryset = ACT.objects.all()
    serializer_class = ACT_Serializer


class AP_CreateView(CreateAPIView):
    queryset = AP.objects.all()
    serializer_class = AP_Serializer


class AP_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = AP.objects.all()
    serializer_class = AP_Serializer


class AP_ListView(ListAPIView):
    queryset = AP.objects.all()
    serializer_class = AP_Serializer


class GRE_CreateView(CreateAPIView):
    queryset = GRE.objects.all()
    serializer_class = GRE_Serializer


class GRE_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = GRE.objects.all()
    serializer_class = GRE_Serializer


class GRE_ListView(ListAPIView):
    queryset = GRE.objects.all()
    serializer_class = GRE_Serializer
