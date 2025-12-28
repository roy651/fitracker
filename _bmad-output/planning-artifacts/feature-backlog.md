# Ski Prep Pro - Feature Backlog

> 📋 Deferred features for future planning cycles

**Last Updated:** 2025-12-27  
**Maintainer:** Roy

---

## 🟡 Mid-Term Features (Next PRD Cycle)

### 1. Exercise Illustration Improvements

**Status:** Deferred - Needs separate PRD  
**Priority:** Medium  
**Category:** UX Enhancement

**Current Issues:**
- White line on black background - poor visibility/contrast
- Illustrations are too small
- Hard to tell what exercise is being demonstrated
- No scalable process for adding new exercises

**Proposed Improvements:**
- [ ] Better contrast/color scheme for illustrations
- [ ] Larger display size during workouts
- [ ] Clearer, more detailed exercise depictions
- [ ] Establish sustainable illustration generation workflow for new drills

**Dependencies:** None identified

---

## 🔵 Long-Term Features (Future Consideration)

### 2. Custom Workout Builder

**Status:** Deferred - Complex scope, needs dedicated discovery  
**Priority:** Low (for now)  
**Category:** Feature Addition

**Concept:**
- Allow users to upload JSON (or similar format) with custom exercises/workouts
- AI-assisted workout generation through external conversation
- Ability to request new workout plans or modify existing ones

**Key Considerations:**
- JSON schema design for user-uploadable workouts
- Validation of user-provided exercise data
- Integration point for AI-powered workout generation
- Storage mechanism (localStorage? cloud sync?)
- Import/export functionality

**Open Questions:**
- Should AI workout generation be built-in or external tool?
- How to handle exercises without illustrations?
- User authentication for cloud storage?

**Dependencies:** 
- May benefit from illustration improvement workflow first
- Need to define JSON schema for workouts

---

## ✅ Completed Features

| Feature | Completed | Notes |
|---------|-----------|-------|
| Exercise Illustrations | 2025-12 | 22 line drawings added (quality issues noted above) |

---

## 🚀 Currently In Progress (This PRD Cycle)

| Feature | PRD Status | Target |
|---------|------------|--------|
| Rest Timer Between Blocks | In Development | v1.1 |
| Voice Announcements | In Development | v1.1 |
| Screen Wake Lock API | In Development | v1.1 |

---

*This backlog is maintained alongside the active PRD to ensure features are not lost.*
