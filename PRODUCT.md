# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Two people sharing one screen (phone or desktop), plus hiring reviewers who open the live URL from a job application and judge craft in the first seconds, then play one round. Both audiences matter equally: obviously playable by anyone, visibly well made.

## Product Purpose
Two-player Tic-Tac-Toe on one device. Success: a stranger understands whose turn it is, plays a full game without instructions, sees the result clearly, and restarts with one tap. For the reviewer, it also has to show taste.

## Positioning
A tiny game with real craft: custom marks and precise motion instead of stock emoji and default styling.

## Capabilities and Constraints
- Next.js App Router, React 19, Tailwind CSS 4, deployed on Vercel. Static, no backend.
- 3x3 board, alternating turns, win and draw detection, score board (wins and draws, per session), a button labelled exactly "New Game".
- Rules live in `lib/game.ts` and `lib/gameReducer.ts` and are covered by tests; the UI redesign must not change rule behavior.
- Squares use `aria-disabled` (not `disabled`) so keyboard focus survives a move.
- Must work at 320px and with keyboard only; light and dark themes follow the system.
- Marks must stay distinguishable without colour alone.

## Brand Commitments
- No emoji anywhere in the interface.
- Player marks are a handwritten-feeling X and O, drawn as custom SVG.
- Motion is crisp and precise: restrained, no confetti, respects reduced motion.
- Needs a favicon.

## Evidence on Hand
Live app: https://tic-tac-toe-react-app-sigma.vercel.app. Repo: https://github.com/AK-Lmn/Tic-Tac-Toe-React-App. No customer, press or usage evidence exists; none to invent.

## Product Principles
1. Whose turn it is and what just happened must be readable at a glance.
2. The board is the hero; everything else is quiet.
3. Craft shows in the marks, the motion and the details, not in extra features.
4. Never trade playability or accessibility for style.
