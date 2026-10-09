from django.contrib import admin

from .models import Challenge, Option, Vote


class OptionInline(admin.TabularInline):
    model = Option
    extra = 3


@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "created_at")
    list_filter = ("is_active",)
    inlines = [OptionInline]


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ("challenge", "option", "voter_key", "created_at")
    list_filter = ("challenge",)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False