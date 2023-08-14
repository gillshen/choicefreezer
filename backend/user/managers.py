from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class CfUserManager(BaseUserManager):
    """Custom manager where a CF email is required for registration"""

    def create_user(self, username, email, password, **extra_fields):
        if not email:
            raise ValueError(_("Email address required"))

        email = self.normalize_email(email)

        if not email.endswith("@choicefree.com.cn"):
            raise ValueError(_("Email address not permitted"))

        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault("is_active", True)
        extra_fields["is_staff"] = True
        extra_fields["is_superuser"] = True
        return self.create_user(username, email, password, **extra_fields)
