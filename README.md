# Versions

## Slightly cleaner handling of undefined housing locations

This was the final change to housing tutorial from Angular, thus completing that tutorial. As such it is the beginner code for this fork.

## Provide proper error handling and validation on details form. (Reactive.)

Addition of model-based validators.

This change brings us to the end of Day 3 Block 1.

## Typo

Trivial.

## Details form now appears to do something at UI level.

These changes are substantial and require a good bit of coding. UX is greatly enhanced.

This change brings us to the end of Day 3 Block 2. (Block 2 is a long block.)

## Added README. Added phone field.

Just to demonstrate how easy it is to add an extra field to the details from

## Added SubmittedApplication type to details to ensure consistency. More work is needed

Title says it all. Before this, handling of submitted detail was getting messy.

## Promoted SubmittedApplication to Interface.

Ensures consistency between details.ts and housing.ts and makes code a little neater.

## Used signals for UI state.

Several updates to details.ts to use Signals instead. The computed signal makes the template markup a tiny bit cleaner. No other changes to other files.

This change brings us to the end of Day 3 Block 3.

# Technical Notes

## Change Detector

The documentation in the tutorial is incomplete.

See https://angular.dev/api/core/ChangeDetectorRef

ChangeDetectorRef must be imported to use it.

## Reactive Forms

See https://codecraft.tv/courses/angular/forms/model-driven-validation/
See https://angular.dev/guide/forms/form-validation#validating-input-in-reactive-forms
