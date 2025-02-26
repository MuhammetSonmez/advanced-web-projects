import icecream
from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class User(models.Model):
    ROLES = [
        ('Mod', 'Mod'),
        ('User', 'User'),
    ]
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLES, default='User')

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.pk:
            self.password = self.password
        super(User, self).save(*args, **kwargs)


    def check_password(self, password):
        icecream.ic(password, self.password)
        return password == self.password

class Category(models.Model):
    category_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.category_name


class Blog(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs')
    title = models.CharField(max_length=200)
    content = models.TextField()
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='blogs')

    def __str__(self):
        return self.title



class Comment(models.Model):
    blog_id = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    comment_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {User(id= self.user_id)} on {Blog(self.blog_id)}"
