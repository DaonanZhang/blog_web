from django.db import models
from django.contrib.auth.models import User

class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']  # 默认按创建时间倒序排序
        verbose_name = 'Blog Post'  # 后台展示的单数名称
        verbose_name_plural = 'Blog Posts'  # 后台展示的复数名称
        
    def __str__(self):
        return self.title
    
    @property 
    def comment_count(self):
        return self.comments.count()
    
class Comment(models.Model):
    blog = models.ForeignKey(Blog, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
