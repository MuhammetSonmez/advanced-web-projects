from email.policy import default

from django.db import models

class Takvim(models.Model):
    name = models.CharField(max_length=255)
    year = models.CharField(max_length=9)

    def __str__(self):
        return f"{self.name} ({self.year})"


class Event(models.Model):
    TERM_CHOICES = [
        ('Güz', 'Güz'),
        ('Bahar', 'Bahar'),
    ]
    takvim = models.ForeignKey(Takvim, related_name="events", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    term = models.CharField(max_length=10, choices=TERM_CHOICES, default = 'Güz')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.term}, {self.start_date} - {self.end_date})"


class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    def check_password(self, password):
        return password == self.password

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"