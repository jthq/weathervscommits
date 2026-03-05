# Weather vs Commits

Exploring if weather affects how much one codes.

<img width="932" height="548" alt="image" src="https://github.com/user-attachments/assets/c58d97fe-dc74-4b2c-ac43-e0fd4ee58950" />

### Conclusion
Looking at this month of data, weather doesn't seem to explain much of the variation in commit volume. The only noticeable pattern is a moderate negative relationship between temperature and commits (r = -0.389), but even that feels tentative. With just a month of data and plenty of other factors I didn't account for, this is really just exploratory. To make a stronger claim, I'd need a longer, multi-season dataset with detailed day-by-day commit history.

### Limitations & Considerations
Single month sample: Only 31 days of data is insufficient for detecting seasonal patterns
Confounding variables: Deadlines, exams, personal schedule, and project deadlines all influence commits
No individual histories: Data is aggregated across students; individual variation is hidden
Synthetic data: Daily commits are synthetically generated rather than real GitHub history
Temporal lag effects: There may be delayed effects between weather and behavior that one month can't capture
