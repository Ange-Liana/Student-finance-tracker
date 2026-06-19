Student Finance Tracker

demo video link : https://www.loom.com/share/63c1a9ff49cc47079f52f88248be493e

wireframe link : https://docs.google.com/document/d/1j2D6BgDjGmocqCxNMfHiXZn-8WQbXxejon8Ag18hzrw/edit?tab=t.0

live site: https://ange-liana.github.io/Student-finance-tracker/

A lightweight, accessible single-page web application built with vanilla HTML5, CSS3, and modern ECMAScript modules. The application is designed to help students log, monitor, and categorize personal daily expenses cleanly on a single scrolling page. The system runs entirely client-side without external frameworks, utilizing modern browser capabilities for validation, state management, and accessibility conformance.

Technical Features
Single-Page Scrolling Architecture: Navigation options in the header function as smooth anchor links that scroll the viewport down to specific stacked panels, preserving user state across the entire workspace.

Live Calculation Metrics: An integrated analytical routine tracks total entry counts, aggregates financial values, and dynamically isolates the top expenditure category upon every data mutation.

7-Day Spend Summary: A chronological data grid automatically aggregates daily transaction volume over a rolling 7-day calendar window to provide an immediate view of recent spending behavior.

Regex Highlight Search: A live filter routine passes user queries into a safe Regular Expression constructor block, dynamically reflecting query matches in the UI using native highlight markers.

Persistent Local Storage: An automated state-saving mechanism bridges the transaction array directly to the browser memory space, maintaining full record persistence across sessions and manual window reloads.

Multi-Currency Conversion: A conversion widget recalculates pricing columns into alternative target indexes (Euros or British Pounds) based on customizable manual exchange rates configured in the options panel.

Data Portability Utilities: A raw string stream utility exposes data arrays as clean JSON payloads for instant text-based export, alongside an asynchronous file reader capable of reconstructing the database from imported backup files.

Regular Expression Catalog
1. Description Field Validation
Expression: ^\S+(.\S+)$

Purpose: Ensures description fields contain meaningful text by strictly preventing leading, trailing, or isolated blank spacing.

Valid: Campus Bookstore Textbooks

Invalid:   Weekly Cafeteria Mealplan

2. Financial Amount Format
Expression: ^(0|[1-9]\d*)(.\d{1,2})?$

Purpose: Validates that financial amounts represent real, positive numbers, accepting either clean integer inputs or explicit floating-point decimals limited to two precision positions.

Valid: 124.50

Invalid: -45.00 or 18.755

3. Chronological Date Format
Expression: ^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$

Purpose: Enforces rigorous calendar timestamp input configurations conforming strictly to the ISO standard YYYY-MM-DD structural order.

Valid: 2026-06-15

Invalid: 15-06-2026 or 2026/06/15

4. Category Classification Format
Expression: ^[A-Za-z]+(?:[ -][A-Za-z]+)*$

Purpose: Restricts classification tags entirely to text characters, safely permitting single internal spaces or hyphens while completely barring numerical digits or special symbols.

Valid: Off-Campus or Entertainment

Invalid: Food & Drinks or Fees_2026

5. Advanced Back-Reference Duplication Check
Expression: \b(\w+)\s+\1\b

Purpose: Uses word boundary markers and a literal back-reference sequence to actively scan descriptions and flag accidental double-word repetitions.

Valid: Monthly Transit Pass Sub

Invalid: Coffee with friends friends

Chosen Theme & Core Aesthetics
The interface is built on a dark purple visual framework optimized for accessibility, minimal visual fatigue, and crisp clarity:

Primary Deep Violet (#6a1b9a / #4a148c): Establishes strong layout orientation, anchoring the sticky main header, validation action buttons, and critical panel dividers.

Midnight Background Palette (#1e122b / #2d1b40): Combines a deep dark-purple canvas with slightly elevated container sheets to organize structural content with a clear sense of visual depth.

Lavender Typography & Accents (#f3e5f5 / #ffd700): Leverages highly readable text contrast coupled with vivid gold target indicators to ensure absolute field visibility.

Keyboard Navigation Map
Tab: Cycles focus forward through navigation links, input criteria, query filters, data checkboxes, and row manipulation triggers in a predictable linear order.

Shift + Tab: Inverts the focus cycling order, stepping backward through previously visited focus elements.

Enter / Space: Executes the behavior associated with the focused element, such as toggling search logic, sorting table entries, or dispatching form payloads.

Arrow Keys: Adjusts active selection parameters inside custom currency dropdown listings or date inputs.

Accessibility Compliance Notes
Skip Link Bypass: A hidden programmatic anchor link sits at the top of the Document Object Model. Tabbing to this link reveals it visually, allowing users to bypass header navigation links and jump directly to the primary information dashboard.

High Contrast Ratios: The text overlays completely conform to deep readability thresholds against their respective backgrounds, meeting high-contrast standards for low-vision users.

Focal Indicators: Custom focus rings utilize a 3px gold border outline on all native and simulated active elements, ensuring a clear visual tracking cue across the screen.

Aria Live Notification Alerts: A dedicated live communication region announces operational feedback to assistive listening software. Normal metrics mutations generate quiet updates, while breaching set caps fires immediate alerts.

Application Runtime Instantiation
Due to browser security protocols surrounding local module processing, native ECMAScript compilation scripts (import and export statements) cannot be evaluated directly from a local disk workspace file directory. The tracker must be initialized inside a live web server pipeline.

Method 1: Visual Studio Code Environment
Launch VS Code and open your project workspace folder containing all code assets.

Open the Extensions Tab (Ctrl+Shift+X), locate the extension titled Live Server, and install it.

Once installed, navigate back to the workspace tree and click the Go Live button located in the bottom status toolbar.

Your browser will instantly open to the application index location at http://127.0.0.1:5500/index.html.

Method 2: System Terminal Commands
If your computer environment has Python or Node.js runtime engines pre-installed, you can spawn an internal server thread from your command-line interface:

Using Python: Change directories directly into the folder housing your code assets and run the following command:
python -m http.server 8000
Open your web browser and navigate directly to: http://localhost:8000

Using Node.js: Change directories directly into your project directory folder and execute:
npx serve
Open your web browser and navigate to the address output shown in your console terminal (typically http://localhost:3000).

Diagnostic Test Suite Evaluation
To verify that the underlying valuation math formulas, data processing modules, local storage persistence loops, and validation logic match target requirements, you can run the diagnostic matrix utility:

Follow the local deployment execution instructions outlined in the server setup steps directly above to ensure your local web host server is active.

Open a new web browser address tab window and navigate directly to the testing file path container:
Example: http://127.0.0.1:5500/tests.html or http://localhost:8000/tests.html

The integrated verification runtime environment automatically hooks directly into your system files, executing isolated evaluation sequences against data collection scenarios.

Review the canvas progress bars generated on the testing dashboard interface. Passing modules report as solid green blocks, whereas processing faults or invalid expression configurations will output diagnostic error logs directly to the browser console.
