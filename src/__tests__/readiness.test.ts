import { calculateScore, TASKS_FOR_SCORE } from "@/context/AppContext";

describe("calculateScore", () => {
  it("returns 0 when no tasks are completed", () => {
    expect(calculateScore([])).toBe(0);
  });

  it("returns 100 when all key tasks are completed", () => {
    expect(calculateScore([...TASKS_FOR_SCORE])).toBe(100);
  });

  it("returns 50 when half of key tasks are completed", () => {
    const half = TASKS_FOR_SCORE.slice(0, TASKS_FOR_SCORE.length / 2);
    expect(calculateScore(half)).toBe(50);
  });

  it("ignores irrelevant tasks in score calculation", () => {
    expect(calculateScore(["some-unrelated-task"])).toBe(0);
  });

  it("does not exceed 100 even with extra tasks", () => {
    const allPlus = [...TASKS_FOR_SCORE, "extra-task-1", "extra-task-2"];
    expect(calculateScore(allPlus)).toBeLessThanOrEqual(100);
  });

  it("calculates correctly with one key task completed", () => {
    expect(calculateScore(["check-eligibility"])).toBe(25);
  });
});
