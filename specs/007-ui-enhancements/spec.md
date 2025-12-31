# Feature Specification: Workout UI Enhancements

**Feature Branch**: `007-ui-enhancements`  
**Created**: 2025-12-30  
**Status**: Draft  
**Source**: User Request

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Larger Drill Images (Priority: P1)

As a user performing a workout, I want the exercise reference image to be larger and more prominent, so I can clearly see the form and technique without squinting.

**Why this priority**: Visual guidance is critical for proper form. Current small images reduce usability during motion.

**Independent Test**: Start a workout and verify the exercise image occupies a significant portion of the screen (e.g., >30% viewport height) and is clearly visible from a distance.

**Acceptance Scenarios**:

1. **Given** the workout player is active, **When** an exercise step begins, **Then** the reference image SHALL be displayed significantly larger than current size
2. **Given** mobile device viewport, **When** image scales, **Then** it SHALL maintain aspect ratio AND not obscure timer or instruction text

### User Story 2 - Visual Preview During Rest (Priority: P2)

As a user resting between sets, I want to see the image of the *next* drill alongside its name, so I can instantly recognize what to prepare for without reading text.

**Why this priority**: Reduces cognitive load during fatigue. "Glanceability" is key for fitness apps.

**Independent Test**: Complete a drill, wait for rest period, and verify the "Next Up" section displays both the name AND the image of the upcoming exercise.

**Acceptance Scenarios**:

1. **Given** the user is in a REST step, **When** the "Next Up" preview is displayed, **Then** it SHALL show the next exercise's visual_ref image alongside its name
2. **Given** the image is displayed in preview, **When** viewed, **Then** it SHALL be smaller than the main active drill image but clearly recognizable

### User Story 3 - Next Drill in Block Rest (Priority: P2)

As a user resting between blocks (Block Rest), I want to see what the first drill of the next block is, so I can prepare equipment or mental focus for the new circuit.

**Why this priority**: Consistency with standard Rest steps. Users currently lose context during long block rests.

**Independent Test**: Complete a full block of exercises, enter Block Rest, and verify the "Next Up" preview appears showing the first drill of the next block.

**Acceptance Scenarios**:

1. **Given** the user enters a BLOCK_REST step, **Then** the UI SHALL display a "Next Up" preview same as standard REST steps
2. **Given** the preview in Block Rest, **Then** it SHALL show the image and name of the *first drill* of the upcoming block

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display exercise images with increased dimensions (approx 1.5x - 2x current size) in standard Work view.
- **FR-002**: System MUST render "Next Up" preview component during REST steps containing both exercise name and visual reference.
- **FR-003**: System MUST render "Next Up" preview component during BLOCK_REST steps targeting the first drill of the next block.
- **FR-004**: System MUST ensure larger images do not break layout on small mobile screens (320px width).
- **FR-005**: System MUST maintain high visual quality for scaled images (avoid pixelation artefacts).

### Key Entities

- **Drill**: Contains `visual_ref` property used for images.
- **WorkoutPlayer**: Main component rendering the UI state.
- **RestView**: Sub-component (or state) showing rest timer and preview.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Exercise image visibility improves (subjective usability: user can identify exercise from 1m distance).
- **SC-002**: "Next Up" contexts (Rest and Block Rest) consistently show visual previews 100% of the time.
- **SC-003**: Layout remains broken-free on iPhone SE size (320px) with larger images.
