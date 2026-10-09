from django.db import models


class Challenge(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Option(models.Model):
    challenge = models.ForeignKey(
        Challenge, related_name="options", on_delete=models.CASCADE
    )
    label = models.CharField(max_length=100)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.label


class Vote(models.Model):
    challenge = models.ForeignKey(
        Challenge, related_name="votes", on_delete=models.CASCADE
    )
    option = models.ForeignKey(
        Option, related_name="votes", on_delete=models.CASCADE
    )
    voter_key = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["challenge", "voter_key"],
                name="unique_vote_per_challenge",
            )
        ]

    def __str__(self):
        return f"{self.voter_key} -> {self.option_id}"
