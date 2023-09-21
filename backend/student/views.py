from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
)

from student.models import (
    Enrollment,
    GPA,
    ClassRank,
    TOEFL,
    IELTS,
    DET,
    SAT,
    ACT,
    AP,
    IBPredicted,
    IBFinal,
    AlevelPredicted,
    AlevelFinal,
    GRE,
    GMAT,
    LSAT,
)

from student.serializers import (
    EnrollmentSerializer,
    EnrollementListItemSerializer,
    EnrollmentPageDataSerializer,
    GPA_Serializer,
    ClassRankSerializer,
    TOEFL_Serializer,
    IELTS_Serializer,
    DET_Serializer,
    SAT_Serializer,
    ACT_Serializer,
    AP_Serializer,
    IBPredictedSerializer,
    IBFinalSerializer,
    AlevelPredictedSerializer,
    AlevelFinalSerializer,
    GRE_Serializer,
    GMAT_Serializer,
    LSAT_Serializer,
)


class StudentQueryMixin:
    _model = None

    def get_queryset(self):
        queryset = self._model.objects.all()
        student_id = self.request.query_params.get("student")
        if student_id is not None:
            queryset = queryset.filter(student=student_id)
        return queryset


class EnrollmentCreateView(CreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer


class EnrollmentUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer


class EnrollmentListView(StudentQueryMixin, ListAPIView):
    _model = Enrollment
    serializer_class = EnrollementListItemSerializer


class EnrollmentRetrieveView(RetrieveAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentPageDataSerializer


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


class TOEFL_ListView(StudentQueryMixin, ListAPIView):
    _model = TOEFL
    serializer_class = TOEFL_Serializer


class IELTS_CreateView(CreateAPIView):
    queryset = IELTS.objects.all()
    serializer_class = IELTS_Serializer


class IELTS_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = IELTS.objects.all()
    serializer_class = IELTS_Serializer


class IELTS_ListView(StudentQueryMixin, ListAPIView):
    _model = IELTS
    serializer_class = IELTS_Serializer


class DET_CreateView(CreateAPIView):
    queryset = DET.objects.all()
    serializer_class = DET_Serializer


class DET_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = DET.objects.all()
    serializer_class = DET_Serializer


class DET_ListView(StudentQueryMixin, ListAPIView):
    _model = DET
    serializer_class = DET_Serializer


class SAT_CreateView(CreateAPIView):
    queryset = SAT.objects.all()
    serializer_class = SAT_Serializer


class SAT_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = SAT.objects.all()
    serializer_class = SAT_Serializer


class SAT_ListView(StudentQueryMixin, ListAPIView):
    _model = SAT
    serializer_class = SAT_Serializer


class ACT_CreateView(CreateAPIView):
    queryset = ACT.objects.all()
    serializer_class = ACT_Serializer


class ACT_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = ACT.objects.all()
    serializer_class = ACT_Serializer


class ACT_ListView(StudentQueryMixin, ListAPIView):
    _model = ACT
    serializer_class = ACT_Serializer


class AP_CreateView(CreateAPIView):
    queryset = AP.objects.all()
    serializer_class = AP_Serializer


class AP_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = AP.objects.all()
    serializer_class = AP_Serializer


class AP_ListView(StudentQueryMixin, ListAPIView):
    _model = AP
    serializer_class = AP_Serializer


class IBPredictedCreateView(CreateAPIView):
    queryset = IBPredicted.objects.all()
    serializer_class = IBPredictedSerializer


class IBPredictedUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = IBPredicted.objects.all()
    serializer_class = IBPredictedSerializer


class IBPredictedListView(StudentQueryMixin, ListAPIView):
    _model = IBPredicted
    serializer_class = IBPredictedSerializer


class IBFinalCreateView(CreateAPIView):
    queryset = IBFinal.objects.all()
    serializer_class = IBFinalSerializer


class IBFinalUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = IBFinal.objects.all()
    serializer_class = IBFinalSerializer


class IBFinalListView(StudentQueryMixin, ListAPIView):
    _model = IBFinal
    serializer_class = IBFinalSerializer


class AlevelPredictedCreateView(CreateAPIView):
    queryset = AlevelPredicted.objects.all()
    serializer_class = AlevelPredictedSerializer


class AlevelPredictedUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = AlevelPredicted.objects.all()
    serializer_class = AlevelPredictedSerializer


class AlevelPredictedListView(StudentQueryMixin, ListAPIView):
    _model = AlevelPredicted
    serializer_class = AlevelPredictedSerializer


class AlevelFinalCreateView(CreateAPIView):
    queryset = AlevelFinal.objects.all()
    serializer_class = AlevelFinalSerializer


class AlevelFinalUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = AlevelFinal.objects.all()
    serializer_class = AlevelFinalSerializer


class AlevelFinalListView(StudentQueryMixin, ListAPIView):
    _model = AlevelFinal
    serializer_class = AlevelFinalSerializer


class GRE_CreateView(CreateAPIView):
    queryset = GRE.objects.all()
    serializer_class = GRE_Serializer


class GRE_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = GRE.objects.all()
    serializer_class = GRE_Serializer


class GRE_ListView(StudentQueryMixin, ListAPIView):
    _model = GRE
    serializer_class = GRE_Serializer


class GMAT_CreateView(CreateAPIView):
    queryset = GMAT.objects.all()
    serializer_class = GMAT_Serializer


class GMAT_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = GMAT.objects.all()
    serializer_class = GMAT_Serializer


class GMAT_ListView(StudentQueryMixin, ListAPIView):
    _model = GMAT
    serializer_class = GMAT_Serializer


class LSAT_CreateView(CreateAPIView):
    queryset = LSAT.objects.all()
    serializer_class = LSAT_Serializer


class LSAT_UpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = LSAT.objects.all()
    serializer_class = LSAT_Serializer


class LSAT_ListView(StudentQueryMixin, ListAPIView):
    _model = LSAT
    serializer_class = LSAT_Serializer
