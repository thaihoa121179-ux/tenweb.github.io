/* Các thông số demo dùng mét, giây và độ; không phải định vị thật.
   Tăng mapScale nếu phòng học nhỏ. Đặt sensitivity thấp nếu dễ đếm nhầm. */
globalThis.MuseumMapConfig = Object.freeze({
  stepLength: 0.7, mapScale: 3, scales: [1, 2, 3, 4, 6],
  sensitivity: 1, minStepMs: 350, minPeakMs: 60, maxPeakMs: 550,
  stepThreshold: 0.95, shakeCeiling: 8, gravityFilter: 0.08,
  headingFilter: 0.22, sensorTimeoutMs: 3000,
  joystickSpeed: 1.35, joystickRadius: 42, avatarRadius: 0.28,
  collisionStep: 0.12, snapDistance: 0.65, snapStrength: 0.08,
  interpolation: 14, maxFrameSeconds: 0.05,
  autoplaySpeed: 2.4, autoplayDwellSeconds: 2, triggerRadius: 5,
  zoneCooldownMs: 8000, zoneExitMargin: 1.2, noticeMs: 8000,
  arrivalRadius: 0.8, rerouteDistance: 2.5, rerouteMs: 1200,
  stairsCost: 6, liftCost: 8, transitionCooldownMs: 2200,
  minZoom: 0.75, maxZoom: 5, maxTrail: 100, trailSeconds: 45,
});
