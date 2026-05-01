/**
 * Tests for the journey roadmap generation logic.
 *
 * Validates that the personalized roadmap produces the correct steps
 * based on different voter profile configurations.
 */

import type { VoterProfile, RoadmapStep } from "@/types";

// ---- Mirror of journey generation logic from page.tsx ----

function generateRoadmap(profile: VoterProfile): RoadmapStep[] {
  const steps: RoadmapStep[] = [
    {
      id: "check-eligibility",
      title: "Check Eligibility",
      description:
        "Ensure you meet the minimum age requirement and hold citizenship.",
    },
  ];

  if (profile.isFirstTime) {
    steps.push({
      id: "register-vote",
      title: "Register to Vote",
      description:
        "Submit Form 6 to register yourself in the electoral roll via the NVSP portal.",
    });
  }

  if (profile.movedRecently) {
    steps.push({
      id: "update-address",
      title: "Update Voter Details",
      description:
        "Fill out Form 8 to shift your constituency to your new current address.",
    });
  } else if (!profile.isFirstTime) {
    steps.push({
      id: "verify-name",
      title: "Verify Name on List",
      description:
        "Check the current electoral roll online to ensure your name is active.",
    });
  }

  if (profile.occupation === "student") {
    steps.push({
      id: "prep-docs",
      title: "Prepare Documents",
      description:
        "Gather your College ID, Aadhar Card, and address proof for verification.",
    });
  } else {
    steps.push({
      id: "prep-docs",
      title: "Prepare Documents",
      description:
        "Gather your Voter ID (EPIC), Pan Card, or Aadhar Card.",
    });
  }

  steps.push({
    id: "find-booth",
    title: "Find Polling Station",
    description:
      "Locate your designated polling booth online a few days before voting.",
  });
  steps.push({
    id: "vote",
    title: "Cast Your Vote",
    description:
      "Head to the booth early, get inked, and press the EVM button.",
  });

  return steps;
}

// ---- Tests ----

describe("generateRoadmap", () => {
  it("generates base steps for a first-time student voter", () => {
    const profile: VoterProfile = {
      ageGroup: "18-25",
      isFirstTime: true,
      movedRecently: false,
      occupation: "student",
    };
    const steps = generateRoadmap(profile);
    const ids = steps.map((s) => s.id);

    expect(ids).toContain("check-eligibility");
    expect(ids).toContain("register-vote");
    expect(ids).toContain("prep-docs");
    expect(ids).toContain("find-booth");
    expect(ids).toContain("vote");
    expect(ids).not.toContain("update-address");
    expect(ids).not.toContain("verify-name");
  });

  it("includes address update step when user moved recently", () => {
    const profile: VoterProfile = {
      ageGroup: "26-40",
      isFirstTime: false,
      movedRecently: true,
      occupation: "working",
    };
    const steps = generateRoadmap(profile);
    const ids = steps.map((s) => s.id);

    expect(ids).toContain("update-address");
    expect(ids).not.toContain("verify-name");
    expect(ids).not.toContain("register-vote");
  });

  it("includes verify-name step for returning voters who haven't moved", () => {
    const profile: VoterProfile = {
      ageGroup: "41-60",
      isFirstTime: false,
      movedRecently: false,
      occupation: "working",
    };
    const steps = generateRoadmap(profile);
    const ids = steps.map((s) => s.id);

    expect(ids).toContain("verify-name");
    expect(ids).not.toContain("register-vote");
    expect(ids).not.toContain("update-address");
  });

  it("always includes eligibility check, find booth, and voting steps", () => {
    const profile: VoterProfile = {
      ageGroup: "60+",
      isFirstTime: false,
      movedRecently: false,
      occupation: "retired",
    };
    const steps = generateRoadmap(profile);
    const ids = steps.map((s) => s.id);

    expect(ids[0]).toBe("check-eligibility");
    expect(ids).toContain("find-booth");
    expect(ids[ids.length - 1]).toBe("vote");
  });

  it("provides student-specific document guidance for student occupation", () => {
    const studentProfile: VoterProfile = {
      ageGroup: "18-25",
      isFirstTime: true,
      movedRecently: false,
      occupation: "student",
    };
    const workingProfile: VoterProfile = {
      ageGroup: "26-40",
      isFirstTime: true,
      movedRecently: false,
      occupation: "working",
    };

    const studentSteps = generateRoadmap(studentProfile);
    const workingSteps = generateRoadmap(workingProfile);

    const studentDocStep = studentSteps.find((s) => s.id === "prep-docs");
    const workingDocStep = workingSteps.find((s) => s.id === "prep-docs");

    expect(studentDocStep?.description).toContain("College ID");
    expect(workingDocStep?.description).toContain("EPIC");
  });

  it("generates at least 4 steps for any profile", () => {
    const profile: VoterProfile = {
      ageGroup: "18-25",
      isFirstTime: false,
      movedRecently: false,
      occupation: "other",
    };
    const steps = generateRoadmap(profile);
    expect(steps.length).toBeGreaterThanOrEqual(4);
  });
});
