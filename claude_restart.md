# Restart Prompt — Frontend Architecture Implementation

## Context

This is a Christmas light show voting website (Vue 3 + Pinia + Vite frontend, Hapi.js + @hapi/nes WebSocket backend). Visitors vote for the next song and see results in near real-time driven by MQTT events (~1-2 seconds).

A design and implementation plan have already been written and committed. Your job is to execute the plan using the **subagent-driven development** approach.

## What Was Decided

- The overall architecture (Vue 3 + Pinia + WebSocket push) is correct and does not change
- Three specific problems need fixing:
  1. The fallback HTTP poll in `AvailSongList.vue` runs unconditionally alongside the WebSocket — it should only run when the WebSocket is disconnected
  2. `AvailSongList.vue` owns a `setInterval` that should be owned by the store
  3. API and WebSocket URLs are hardcoded strings — they should use Vite env vars

## Documents to Read First

- **Design spec:** `docs/superpowers/specs/2026-04-26-frontend-architecture-design.md`
- **Implementation plan:** `docs/superpowers/plans/2026-04-26-frontend-architecture.md`

## Your Task

Read the implementation plan, then invoke the `superpowers:subagent-driven-development` skill to execute it task by task.
