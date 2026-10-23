# A Beautiful Day — Phase 4 Motion Experience

Status: Phase 4 code and validation complete, 2026-10-23. At this phase handoff, Phase 5 release/integration gates remained open; their final status is recorded in [Phase 5 Release Review](./phase-5-release-review.md). The template remains `draft` at `0.1.0` pending the media projection/release gates described there.

## Direction and acceptance map

The signature is an inviting reception stage: the existing curtain frame settles into place, warm light crosses the stage, and the photo/artwork planes respond gently to desktop scroll. There is no opening gate or scroll lock. Names, event details and actions remain normal HTML. Ivory paper, Lora, bamboo rules and the approved flowers carry identity without couple photos.

| Surface | Technique, purpose and trigger | Timing | Mobile / reduced motion / fallback | Budget and acceptance |
| --- | --- | --- | --- | --- |
| Every visual section | Explicit semantic `data-motion-variant` targets; Motion entrance follows reading order after entering the lower two thirds of the viewport. Decorative transforms have separate ownership. | Local duration .82s, stagger .12s, listStagger .10s, ease [.22,1,.36,1]; reduced delay zero. | Visible initial HTML; only observed targets are animated. Editor and reduced motion stay static. Missing IntersectionObserver leaves content visible. | One scoped observer system; cleanup cancels controls and restores targets. No broad all-image/child selectors. |
| Hero | Curtain material settle, warm light pass, independent photo/frame/flower depth; introduction precedes names, summary and action. | 1.2s stage settle; bounded light passage 4.8s; scroll planes max 24px. | Static completed frame and natural text flow on mobile/reduced; no interaction gate. | At most three depth planes, no layout/filter animation. |
| Announcement / couple | Letter line reveals; portraits, captions, names and biographies enter individually. | Shared tokens; tiny finite ornament drift. | Natural P3 stacking; no decor over text/faces. | Approved bloom/cluster only. |
| Story | Desktop sticky introduction and chapter progress rail support reading through milestones; each date/image/title/body enters separately. | Progress follows section scroll; content uses shared entrance tokens. | Vertical timeline on touch/tablet/reduced; all chapters stay accessible without effects. | No pinned viewport or horizontal dependency; one progress transform. |
| Events / countdown / venues | Time-first stagger, isolated accurate countdown, restrained map-pin and lantern presence. | Shared entrance; ambient finishes within 4.8s. Countdown updates once per second in its own component. | Static motion with accurate values; invalid/past event never produces negative units. | No parent tick renders, no announcements every second. |
| Gallery | Editorial grid becomes tactile photo frames; fine-pointer hover depth and accessible full image dialog. Visible previous/next/close, Arrow keys, Home/End, Escape, focus trap/restore. | 220ms interaction, shared entrance; dialog 220ms. | Same visible controls and grid on touch; no tilt/reduced transitions. Native dialog fallback keeps close/focus path. | No auto-advance, no drag requirement, only selected full image. |
| Schedule / party / dress / travel / FAQ | Explicit heading, repeated item and supporting detail entrances; tiny paper-light punctuation in each visible chapter. Native disclosure remains intact. | Shared tokens; finite 4.8s ambient. | Native vertical flow and native FAQ; no animated heights. | Decor remains behind semantic content; all optional/empty/reorder behavior preserved. |
| RSVP / guestbook / gift / footer | Copy and controls arrive in reading order; restrained light/botanical movement finishes before sustained form reading. | Shared entrance; finite ambient. | Static editor/reduced; forms retain existing draft transaction status. | No fake submission success, API, music or release scope. |
| Navigation / scroll | Existing shared `useSmoothTemplateScroll` on desktop fine pointer; native anchors and sticky offsets stay intact. | Existing Verdant profile. | Native touch, keyboard and reduced motion; no new global scroll owner. | Active chapter indicated semantically and with underline; no focus movement on scroll. |

## Motion ownership and lifecycle

Initial HTML has no hidden entrance styles. The local Motion effect observes only marked semantic targets, animates a target once when visible, and cancels/restores it on reduced-motion changes or cleanup. Artwork never receives entrance opacity/transforms; its CSS ambient and dedicated stage depth wrappers own those independently. Every chapter has a small paper-light layer with one finite passage. CSS animations pause when the chapter leaves view or the document becomes hidden, and are disabled in editor/reduced motion. Scroll depth subscribes only for eligible desktop viewports and cleans up on resize/unmount. No new dependency, canvas, generated image, global stylesheet or shared component is required.

The local media-query subscription responds to preference changes while mounted. Desktop eligibility also gates the existing shared Lenis hook, so switching to touch/mobile stops it immediately and switching back restores the desktop strategy. Without IntersectionObserver or matchMedia, the renderer never enables motion classes and displays the completed static stage. Hero curtain material motion is desktop-only; touch/mobile keeps the completed frame. Hidden-tab handling pauses active Motion controls as well as CSS/depth work.

The gallery uses native modal dialog with a visible-control fallback, traps focus, restores the triggering photo button, supports Arrow/Home/End/Escape keys, and locks/restores document scrolling. Opening pauses Lenis. An image failure removes that image from the projection; failure of the selected image closes the modal, and an exhausted gallery removes its section/navigation as in P3. Editor photo controls remain disabled. Countdown intervals belong to a small child component, stop on hidden tabs/completion/unmount, and keep the root free of ticks.

## Validation gate

- Preserve all twelve P3 regression tests and add meaningful gallery, motion fallback/lifecycle, and countdown behavior tests.
- Run scoped tests, frontend typecheck and lint; parent performs desktop/tablet/mobile/reduced-motion browser matrix and independent visual review.
- Audit final template config shape, keys, fields, media ownership, capabilities and `draft` / `0.1.0` status.
- P5 asset optimization/alpha edges, API adapters, event calendar, music, SEO and publication remain open.

## Automated verification and final config audit

- All sixteen renderer tests pass: twelve P3 regressions plus gallery keyboard/focus/scroll restoration, open-image failure cleanup, static editor, and countdown completion with timer cleanup.
- Three motion lifecycle tests pass: reactive reduced/desktop subscriptions and listener cleanup; missing-observer fallback; explicit semantic observation, hidden-tab pause and complete style restoration.
- All twenty shared countdown render-ownership tests pass. The root renderer does not own countdown ticks.
- Frontend typecheck, lint and production build pass (existing large-chunk warning remains).
- `template-config.ts` retains its common outer shape, `WEDDING_WEBSITE`, draft `0.1.0`, nineteen canonical keys (eighteen visual plus global music), seven required sections, fixed opening/footer, preview path, editor/media paths and item limits. No renderer-owned art becomes editable media. Existing capabilities still describe intended integration support; they do not claim completed public API/music/SEO adapters.

Parent browser review passes seventeen scenarios: all optional visual sections at 320/375/390/480/768/1280/1440px; empty media; reversed section order; long copy; broken media; reduced motion at 390/768/1440px; static editor; motion NONE; unavailable IntersectionObserver. All preserve visible headings, valid anchors, no horizontal/content overflow, no runtime exception and the P3 media/section fallbacks. Gallery checks cover modal focus, Tab containment, controls, Arrow/Home/End/Escape and opener restoration. Live desktop → touch → desktop and reduced-motion → normal changes correctly destroy/recreate desktop scrolling and motion. Hidden-tab simulation pauses thirteen running animations to zero and resumes on visibility.

Supplemental scroll measurements show hero frame/photo offsets −4.90px/+8.39px inside their 14px/24px bounds; story progress advances from 0 to .714 and its sticky introduction stays at 128px, below the 82px navigation. Independent screenshot review found portrait story media cropped by the landscape frame; story media now uses `contain` on the paper mat, preserving the full image with no focal-point assumption. Final screenshot artifacts are temporary/ignored under `tmp/abd-p4-review/`.
