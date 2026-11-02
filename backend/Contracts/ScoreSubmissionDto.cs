namespace WordLadder.Backend.Contracts;

public class ScoreSubmissionDto
{
    public int LevelId { get; set; }
    public string PlayerId { get; set; } = string.Empty;
    public List<string> LadderSteps { get; set; } = new();
    public int DurationSeconds { get; set; }
    public DateTime SubmittedAtUtc { get; set; } = DateTime.UtcNow;
}

public class ScoreVerificationResultDto
{
    public bool IsValidSolution { get; set; }
    public int VerifiedMoves { get; set; }
    public int ServerOptimalMoves { get; set; }
    public int StarsAwarded { get; set; }
    public bool IsOptimal { get; set; }
    public string? RejectionReason { get; set; }
}

public class LevelDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int WordLength { get; set; }
    public string StartWord { get; set; } = string.Empty;
    public string TargetWord { get; set; } = string.Empty;
    public int OptimalMoves { get; set; }
    public int MaxMoves { get; set; }
    public int Tier { get; set; }
}
