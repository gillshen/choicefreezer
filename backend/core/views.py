from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
)

from core.models import (
    CfProduct,
    Student,
    Contract,
    Service,
    Application,
    MajorChoice,
    ApplicationLog,
)

from core.serializers import (
    # Create, update, delete
    CfProductSerializer,
    StudentSerializer,
    ContractSerializer,
    ServiceSerializer,
    ApplicationSerializer,
    MajorChoiceSerializer,
    ApplicationLogSerializer,
    # List items
    StudentListItemSerializer,
    ContractListItemSerializer,
    ApplicationListItemSerializer,
)


class CfProductCreateView(CreateAPIView):
    queryset = CfProduct.objects.all()
    serializer_class = CfProductSerializer


class CfProductRetrieveView(RetrieveAPIView):
    queryset = CfProduct.objects.all()
    serializer_class = CfProductSerializer


class CfProductUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = CfProduct.objects.all()
    serializer_class = CfProductSerializer


class StudentCreateView(CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentRetrieveView(RetrieveAPIView):
    queryset = Student.objects.all()
    # TODO?
    serializer_class = StudentSerializer


class StudentUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class ContractCreateView(CreateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer


class ContractUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer


class ServiceCreateView(CreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class ServiceUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class ApplicationCreateView(CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


class ApplicationRetrieveView(RetrieveAPIView):
    queryset = Application.objects.all()
    # TODO
    serializer_class = ApplicationSerializer


class ApplicationUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


class MajorChoiceCreateView(CreateAPIView):
    queryset = MajorChoice.objects.all()
    serializer_class = MajorChoiceSerializer


class MajorChoiceUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = MajorChoice.objects.all()
    serializer_class = MajorChoiceSerializer


class ApplicationLogCreateView(CreateAPIView):
    queryset = ApplicationLog.objects.all()
    serializer_class = ApplicationLogSerializer


class ApplicationLogUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = ApplicationLog.objects.all()
    serializer_class = ApplicationLogSerializer


class CfProductListView(ListAPIView):
    queryset = CfProduct.objects.all()
    serializer_class = CfProductSerializer


class StudentListView(ListAPIView):
    serializer_class = StudentListItemSerializer

    def get_queryset(self):
        query_params = self.request.query_params

        return Student.filter(
            username=query_params.get("username"),
            is_current=query_params.get("is_current"),
            current_for_user=query_params.get("current_for_user"),
            target_year=query_params.get("target_year"),
        )


class ContractListView(ListAPIView):
    serializer_class = ContractListItemSerializer

    def get_queryset(self):
        student_id = self.request.query_params.get("student")
        return Contract.filter(student_id=student_id)


class ApplicationListView(ListAPIView):
    serializer_class = ApplicationListItemSerializer

    def get_queryset(self):
        query_params = self.request.query_params

        return Application.filter(
            username=query_params.get("username"),
            student_id=query_params.get("student"),
            school_id=query_params.get("school"),
            program_id=query_params.get("program"),
            target_id=query_params.get("target"),
            subtarget_id=query_params.get("subtarget"),
        )


class ApplicationLogListView(ListAPIView):
    serializer_class = ApplicationLogSerializer

    def get_queryset(self):
        application_id = self.request.query_params.get("application")
        return ApplicationLog.filter(application_id=application_id)
