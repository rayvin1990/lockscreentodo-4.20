import { ImageResponse } from "next/og";

export function generateLockscreenImage(
  tasks: string[],
  template: string = "calm-list",
  gradient: string = "linear-gradient(160deg, #20251f 0%, #4b5549 48%, #111318 100%)",
  heroMetric?: string,
  daysLeft: string = "days left"
) {
  const isLarge = template === "large-reminder";
  const isCountdown = template === "countdown";
  const isInterruption = template === "interruption";
  const isOps = template === "ops-alert";
  const isUrgent = template === "urgent";
  const isFitness = template === "fitness";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: gradient,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        />
        {isCountdown ? (
          <div style={{ display: "flex", flexDirection: "column", zIndex: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "160px", fontWeight: 900, lineHeight: 1 }}>{heroMetric || "30"}</div>
              <div style={{ marginTop: "20px", fontSize: "24px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.35em", color: "rgba(255,255,255,0.6)" }}>{daysLeft}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "100px", gap: "24px" }}>
              {tasks.slice(1, 4).map((task) => (
                <TaskPill key={task} text={task} />
              ))}
            </div>
          </div>
        ) : isLarge || isInterruption || isOps || isUrgent ? (
          <div style={{ display: "flex", flexDirection: "column", zIndex: 10 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "48px",
                border: isOps ? "2px solid rgba(252, 165, 165, 0.4)" : "2px solid rgba(255, 255, 255, 0.2)",
                backgroundColor: isOps ? "rgba(69, 10, 10, 0.55)" : "rgba(0, 0, 0, 0.3)",
                padding: "60px",
                textAlign: "center",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              {(isOps || isUrgent) && (
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(254, 202, 202, 1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "32px" }}>
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              )}
              <div style={{ fontSize: isInterruption ? "48px" : "64px", fontWeight: 900, lineHeight: 1.2 }}>
                {tasks[0]}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "80px", gap: "24px" }}>
              {tasks.slice(1, 4).map((task) => (
                <TaskPill key={task} text={task} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", zIndex: 10, gap: "24px" }}>
            {tasks.slice(0, 4).map((task, index) => {
              const isFirst = index === 0 && !isFitness;
              return (
                <div
                  key={task}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "32px",
                    border: isFirst ? "2px solid rgba(255, 255, 255, 0.1)" : "2px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor: isFirst ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.15)",
                    padding: "32px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isFirst ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.4)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "24px", flexShrink: 0 }}>
                    {isFirst ? (
                      <>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </>
                    ) : (
                      <circle cx="12" cy="12" r="10" />
                    )}
                  </svg>
                  <span
                    style={{
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: isFirst ? "rgba(255,255,255,0.45)" : "white",
                      textDecoration: isFirst ? "line-through" : "none",
                    }}
                  >
                    {task}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    }
  );
}

function TaskPill({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        borderRadius: "32px",
        border: "2px solid rgba(255, 255, 255, 0.15)",
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        padding: "24px 32px",
        fontSize: "32px",
        fontWeight: "bold",
        color: "white",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
    >
      {text}
    </div>
  );
}
