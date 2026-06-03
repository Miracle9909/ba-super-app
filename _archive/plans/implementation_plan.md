# Phase 1: Input Processing & Domain Extraction

This phase focuses on improving how the BA Super App ingests input data and extracts domain models (Entities, Business Rules, Glossary).

## Proposed Changes

### 1. Real URL Fetching (Input Processing)
Replace the stub in `handleUrlImport` with a real `fetch` call. To bypass CORS issues typical of a client-side only app, we will use a public CORS proxy (e.g., `api.allorigins.win`). 
- Show a loading indicator during fetch.
- Parse the resulting HTML to extract text content.
- Append the extracted text to the project's brief documents.

### 2. Manual Domain Model Management
Allow users to manually add, edit, and delete Domain Model items (Entities, Glossary, Business Rules).
- **[NEW] `domainModal` in `index.html`**: A generic modal for adding items to the current active tab (Entities/Glossary/Rules).
- **[MODIFY] `app.js`**: Implement `openDomainForm`, `saveDomainItem`, and `deleteDomainItem` to manage the manual addition and removal of domain items in the project state. Update `renderDomainModel` to show "Delete" buttons for manually managed accuracy.

### 3. Context Engine Refinement
Improve `parseContext` to combine AI-extracted domain models with user-defined ones, ensuring that manual entries are preserved when re-running the analysis.

## User Review Required

> [!IMPORTANT]  
> Using a public CORS proxy (`allorigins`) is acceptable for a demo/MVP, but in a real production environment, a dedicated backend service should be used to fetch and sanitize URL content.

## Verification Plan

### Manual Verification
1. Input a real URL (e.g., a Wikipedia page or a Jira ticket if public) and verify that text is imported successfully.
2. Navigate to "Domain Model", click "+ Thêm thủ công" (Add Manually) on each tab (Entities, Glossary, Rules).
3. Verify that the new items are saved, displayed correctly, and persist in local storage.
4. Verify that running "Phân tích" (Analyze) does not overwrite the manually added items.
