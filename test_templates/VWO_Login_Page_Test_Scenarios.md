# VWO Login Page — Test Scenarios

**Application URL:** https://app.vwo.com/
**Total Scenarios:** 97

---

## Login – UI

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_001 | Verify that the VWO login page loads successfully at https://app.vwo.com/. | Browser with internet connectivity. | Login page loads completely with all UI elements visible. | High |
| TS_LGN_002 | Verify that the page title is displayed as "Login - VWO". | Login page is loaded. | Browser tab shows the title "Login - VWO". | Medium |
| TS_LGN_003 | Verify that the VWO logo is displayed at the top of the login form. | Login page is loaded. | VWO logo is visible at the top of the login form area. | Low |
| TS_LGN_004 | Verify that the email input field is displayed with placeholder text "Enter email ID". | Login page is loaded. | Email input field is present with the placeholder "Enter email ID". | High |
| TS_LGN_005 | Verify that the password input field is displayed with placeholder text "Enter password". | Login page is loaded. | Password input field is present with the placeholder "Enter password". | High |
| TS_LGN_006 | Verify that a password visibility toggle icon (eye) is present inside the password field. | Login page is loaded. | Eye icon is visible inside the password input field. | Medium |
| TS_LGN_007 | Verify that the "Forgot Password?" link is displayed below the password field. | Login page is loaded. | "Forgot Password?" link is visible and clickable. | Medium |
| TS_LGN_008 | Verify that the "Remember me" checkbox is displayed and is unchecked by default. | Login page is loaded. | "Remember me" checkbox is visible and not checked. | Medium |
| TS_LGN_009 | Verify that the "Sign in" primary button is displayed. | Login page is loaded. | "Sign in" button is visible and styled as the primary action. | High |
| TS_LGN_010 | Verify that the "Or" separator is displayed between the Sign in button and alternative login options. | Login page is loaded. | "Or" text divider is visible separating primary and alternative login options. | Low |
| TS_LGN_011 | Verify that the "Sign in with Google" button is displayed with the Google icon. | Login page is loaded. | "Sign in with Google" button is visible with the Google "G" icon. | Medium |
| TS_LGN_012 | Verify that the "Sign in using SSO" button is displayed. | Login page is loaded. | "Sign in using SSO" button is visible. (PRD confirms SSO support) | Medium |
| TS_LGN_013 | Verify that the "Sign in with Passkey" button is displayed. | Login page is loaded. | "Sign in with Passkey" button is visible. | Medium |
| TS_LGN_014 | Verify that the "New to VWO? Start a free trial" link is displayed at the bottom of the login form. | Login page is loaded. | "New to VWO? Start a free trial" text and link are visible. | Low |
| TS_LGN_015 | Verify that the VWO + ABTasty branding section is displayed on the right side of the page. | Login page is loaded on desktop viewport. | Right panel shows VWO + ABTasty branding with partnership text. | Low |

## Login – Email/Password

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_016 | Verify that a user can sign in with a valid registered email and correct password. | Valid user account exists in the system. | User is authenticated and redirected to the VWO dashboard. | High |
| TS_LGN_017 | Verify that after successful login, the user is redirected to the VWO dashboard. | Valid credentials are submitted. | User is redirected to the VWO dashboard page. | High |
| TS_LGN_018 | Verify that the dashboard loads within 2 seconds after successful login. | User has just completed successful login. | Dashboard is fully loaded and interactive within 2 seconds. (PRD: dashboard responds within 2 seconds) | High |
| TS_LGN_019 | Verify login behavior when the email field is left empty and "Sign in" is clicked. | Password field may or may not be filled. | System prevents login and displays a validation indication. (Exact message: Needs clarification — PRD does not specify) | High |
| TS_LGN_020 | Verify login behavior when the password field is left empty and "Sign in" is clicked. | Email field is filled with a valid email. | System prevents login and displays a validation indication. (Exact message: Needs clarification — PRD does not specify) | High |
| TS_LGN_021 | Verify login behavior when both email and password fields are empty and "Sign in" is clicked. | Login page is loaded, no fields are filled. | System prevents login and displays a validation indication. (Exact message: Needs clarification — PRD does not specify) | High |
| TS_LGN_022 | Verify login behavior with a valid registered email but incorrect password. | Valid email exists. Incorrect password entered. | System denies login and displays an error indication. (Exact message: Needs clarification — PRD does not specify) | High |
| TS_LGN_023 | Verify login behavior with an unregistered/non-existent email address. | Email is not registered in the system. | System denies login and displays an error indication. (Exact message: Needs clarification — PRD does not specify) | High |
| TS_LGN_024 | Verify login behavior with an email in invalid format (e.g., missing "@" symbol). | Login page is loaded. Email like "userexample.com" entered. | System prevents login with a validation message for invalid email format. | High |
| TS_LGN_025 | Verify login behavior with an email missing the domain part (e.g., "user@"). | Login page is loaded. | System prevents login with a validation message for invalid email format. | Medium |
| TS_LGN_026 | Verify login behavior with an email missing the local part (e.g., "@domain.com"). | Login page is loaded. | System prevents login with a validation message for invalid email format. | Medium |
| TS_LGN_027 | Verify login behavior with a 1-character email local part (e.g., "a@domain.com"). | Login page is loaded. | Needs clarification: PRD does not specify minimum email length requirements. | Low |
| TS_LGN_028 | Verify login behavior with a very long email address (e.g., 254 characters — RFC 5321 max). | Login page is loaded. | Needs clarification: PRD does not specify maximum email length accepted. | Low |
| TS_LGN_029 | Verify login behavior with a 1-character password. | Login page is loaded. | Needs clarification: PRD does not specify minimum password length requirements. | Medium |
| TS_LGN_030 | Verify login behavior with a very long password (e.g., 256+ characters). | Login page is loaded. | Needs clarification: PRD does not specify maximum password length accepted. | Low |
| TS_LGN_031 | Verify login behavior when email has leading spaces (e.g., "  user@domain.com"). | Login page is loaded. | Needs clarification: PRD does not specify whether leading/trailing spaces are trimmed. | Low |
| TS_LGN_032 | Verify login behavior when email has trailing spaces (e.g., "user@domain.com  "). | Login page is loaded. | Needs clarification: PRD does not specify whether leading/trailing spaces are trimmed. | Low |
| TS_LGN_033 | Verify login behavior when email contains uppercase letters (e.g., "User@Domain.COM"). | Login page is loaded. Account registered with lowercase. | Needs clarification: PRD does not specify whether email comparison is case-insensitive. | Low |
| TS_LGN_034 | Verify login behavior when the user clicks "Sign in" multiple times rapidly. | Valid email and password entered. | System should handle multiple clicks gracefully without duplicate login requests. | Medium |
| TS_LGN_035 | Verify login behavior when there is no internet connectivity after page load. | Login page is loaded. Network is then disconnected. | System should display an appropriate network error indication. | Medium |
| TS_LGN_036 | Verify that pressing Enter/Return key after typing password submits the login form. | Valid email and password are entered. | Login form is submitted as if "Sign in" button was clicked. | Medium |

## Login – Password Field

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_037 | Verify that the password field masks entered characters by default (input type="password"). | Login page is loaded. User types in the password field. | Characters are masked (shown as dots/asterisks). | High |
| TS_LGN_038 | Verify that clicking the visibility toggle (eye icon) reveals the password in plain text. | Password characters are entered and masked. | Password becomes visible as plain text. | Medium |
| TS_LGN_039 | Verify that clicking the visibility toggle again hides the password. | Password is currently visible in plain text. | Password is masked again. | Medium |
| TS_LGN_040 | Verify that the password field does not allow text to be copied (right-click > copy or Ctrl+C). | Password is entered in the field. | Needs clarification: PRD does not specify copy prevention for password fields. | Low |

## Login – Remember Me

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_041 | Verify that checking "Remember me" before login maintains the session after browser is closed and reopened. | Valid credentials entered. "Remember me" is checked. | User remains logged in after closing and reopening the browser. | Medium |
| TS_LGN_042 | Verify that without checking "Remember me", the session is not maintained after browser is closed. | Valid credentials entered. "Remember me" is NOT checked. | User is redirected to the login page after closing and reopening the browser. | Medium |
| TS_LGN_043 | Verify the duration for which "Remember me" keeps the session active. | "Remember me" was checked during previous login. | Needs clarification: PRD does not specify the session duration for "Remember me". | Low |

## Login – Forgot Password

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_044 | Verify that clicking "Forgot Password?" navigates to the password reset page. | Login page is loaded. | User is navigated to a password recovery/reset page. | High |
| TS_LGN_045 | Verify that submitting a valid registered email on the Forgot Password page initiates password recovery. | Forgot Password page is loaded. Valid registered email entered. | System initiates password recovery process (e.g., sends recovery email). (Exact flow: Needs clarification — PRD does not detail the recovery mechanism) | High |
| TS_LGN_046 | Verify Forgot Password behavior when an unregistered email is submitted. | Forgot Password page is loaded. Unregistered email entered. | Needs clarification: PRD does not specify the response for unregistered emails on Forgot Password. | Medium |
| TS_LGN_047 | Verify Forgot Password behavior when the email field is left empty and submitted. | Forgot Password page is loaded. Email field is empty. | System should display a validation message requiring email input. | Medium |

## Login – Google Sign-In

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_048 | Verify that clicking "Sign in with Google" initiates the Google authentication flow. | Login page is loaded. | Google authentication popup or redirect is triggered. | High |
| TS_LGN_049 | Verify that a user with a valid Google account linked to VWO can successfully sign in via Google. | Google account is linked to a VWO account. | User is authenticated via Google and redirected to the VWO dashboard. | High |
| TS_LGN_050 | Verify behavior when a user cancels the Google authentication popup. | Google auth popup is displayed. | User is returned to the VWO login page without error. (Exact behavior: Needs clarification — PRD does not detail cancellation handling) | Medium |
| TS_LGN_051 | Verify behavior when a Google account is not linked to any VWO account. | Google auth completes, but no VWO account is linked. | Needs clarification: PRD does not specify behavior for unlinked Google accounts. | Medium |

## Login – SSO

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_052 | Verify that clicking "Sign in using SSO" initiates the SSO authentication flow. | Login page is loaded. | User is directed to the SSO configuration/entry page. (PRD confirms SSO support) | High |
| TS_LGN_053 | Verify that a user from an SSO-configured organization can successfully sign in via SSO. | Organization has SSO configured with VWO. | User is authenticated via SSO and redirected to the VWO dashboard. | High |
| TS_LGN_054 | Verify SSO login behavior when the organization does not have SSO configured. | User attempts SSO login from a non-SSO organization. | System denies SSO login and displays an appropriate indication. (Exact message: Needs clarification) | High |
| TS_LGN_055 | Verify SSO login behavior when the SSO identity provider is unreachable. | SSO is configured but IdP server is unavailable. | Needs clarification: PRD does not specify fallback behavior when SSO IdP is unavailable. | Medium |

## Login – Passkey

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_056 | Verify that clicking "Sign in with Passkey" initiates the passkey/biometric authentication flow. | Login page is loaded. Device supports passkeys. | Passkey/biometric authentication prompt is displayed. (Note: Passkey is not explicitly mentioned in PRD — observed on live UI only) | High |
| TS_LGN_057 | Verify that a user with a registered passkey can successfully sign in. | User has registered a passkey for their account. | User is authenticated via passkey and redirected to the VWO dashboard. | High |
| TS_LGN_058 | Verify Passkey login behavior when the user cancels the biometric/passkey prompt. | Passkey prompt is displayed. | Needs clarification: PRD does not mention passkeys — cancellation behavior unspecified. | Medium |
| TS_LGN_059 | Verify Passkey login behavior on a device that does not support passkeys. | Login page loaded on a device without passkey support. | Needs clarification: PRD does not mention passkeys — unsupported device behavior unspecified. | Medium |

## Login – 2FA

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_060 | Verify that 2FA prompt is displayed after entering valid email and password when 2FA is enabled for the account. | User account has 2FA enabled. Valid email and password entered. | After successful email/password validation, system prompts for the second authentication factor. (PRD: Two-factor authentication) | High |
| TS_LGN_061 | Verify that entering a valid 2FA code completes the login process. | 2FA prompt is displayed. | User is authenticated and redirected to the VWO dashboard. | High |
| TS_LGN_062 | Verify that entering an invalid 2FA code is rejected. | 2FA prompt is displayed. Invalid code entered. | System denies authentication and displays an error indication. (Exact message: Needs clarification — PRD does not specify) | High |
| TS_LGN_063 | Verify behavior when an expired 2FA code is entered. | 2FA code has expired. (Exact expiration: Needs clarification — PRD does not specify) | System denies authentication and indicates the code is invalid or expired. | Medium |
| TS_LGN_064 | Verify behavior when 2FA code is entered with fewer digits than expected. | 2FA prompt is displayed. Fewer digits entered. | Needs clarification: PRD does not specify the expected length of 2FA codes. | Low |
| TS_LGN_065 | Verify behavior when 2FA code is entered with more digits than expected. | 2FA prompt is displayed. Extra digits entered. | Needs clarification: PRD does not specify the expected length of 2FA codes. | Low |
| TS_LGN_066 | Verify behavior after multiple consecutive failed 2FA attempts. | 2FA prompt is displayed. User enters wrong code multiple times. | Needs clarification: PRD does not specify lockout policy after failed 2FA attempts. | High |

## Login – Security

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_067 | Verify that the login page is served over HTTPS with valid TLS certificate. | Login page URL is accessed. | Page is loaded over HTTPS with a valid TLS certificate. (PRD: Encryption in transit (TLS)) | High |
| TS_LGN_068 | Verify that login activity is captured in the activity log. | User performs a successful login. | Login event is recorded in the activity log with timestamp and user details. (PRD: Activity logging) | High |
| TS_LGN_069 | Verify that failed login attempts are captured in the activity log. | User performs a failed login attempt. | Failed login event is recorded in the activity log. (PRD: Activity logging) | High |
| TS_LGN_070 | Verify that SQL injection payloads in the email field are handled securely. | SQL injection string entered in email field (e.g., "' OR 1=1 --"). | System sanitizes input. No unauthorized access or database error occurs. | High |
| TS_LGN_071 | Verify that SQL injection payloads in the password field are handled securely. | SQL injection string entered in password field. | System sanitizes input. No unauthorized access or database error occurs. | High |
| TS_LGN_072 | Verify that XSS payloads in the email field are handled securely. | XSS script entered in email field (e.g., "<script>alert(1)</script>"). | System sanitizes input. Script is not executed in the browser. | High |
| TS_LGN_073 | Verify that XSS payloads in the password field are handled securely. | XSS script entered in password field. | System sanitizes input. Script is not executed in the browser. | High |
| TS_LGN_074 | Verify that the login error message does not reveal whether the email or password is incorrect (generic error). | Invalid credentials submitted. | Error message should be generic and not disclose which field is wrong. (Exact message: Needs clarification — PRD does not specify) | High |
| TS_LGN_075 | Verify behavior after multiple consecutive failed login attempts (brute-force protection). | User enters wrong credentials multiple times consecutively. | Needs clarification: PRD does not specify account lockout or rate-limiting policy for failed login attempts. | High |
| TS_LGN_076 | Verify login behavior when a user logs in from a new/unrecognized IP address or location. | User logs in from a previously unused IP/location. | Needs clarification: PRD does not specify whether IP/location-based security checks are enforced. | Medium |

## Login – Session

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_077 | Verify that an already logged-in user navigating to app.vwo.com is redirected to the dashboard. | User has an active authenticated session. | Needs clarification: PRD does not specify session redirect behavior for authenticated users. | Medium |
| TS_LGN_078 | Verify that the session expires after a period of inactivity. | User is logged in and remains idle. | Needs clarification: PRD does not specify session timeout duration. | Medium |
| TS_LGN_079 | Verify behavior when a user logs in simultaneously from two different devices/browsers. | User has valid credentials and two separate browsers. | Needs clarification: PRD does not specify concurrent session policy. | Medium |

## Login – RBAC

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_080 | Verify that after login, the user sees features and options appropriate to their assigned RBAC role. | User is logged in with a specific role (e.g., admin, viewer). | Dashboard and navigation reflect only the permissions assigned to the user role. (PRD: Role-based access control) | High |
| TS_LGN_081 | Verify that a user with a restricted role cannot access admin-level features after login. | User with restricted RBAC role is logged in. | Restricted features are not accessible. (PRD: RBAC) | High |

## Login – Navigation

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_082 | Verify that clicking "Start a free trial" navigates to the VWO registration/sign-up page. | Login page is loaded. | User is navigated to the VWO sign-up/free trial page. | Medium |
| TS_LGN_083 | Verify that the login page URL https://app.vwo.com/ is directly accessible via the browser address bar. | Browser with internet connectivity. | Login page loads correctly when URL is entered directly. | Medium |
| TS_LGN_084 | Verify browser back button behavior from the login page. | User navigated to the login page from another page. | Browser back button navigates to the previous page. | Low |

## Login – Usability

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_085 | Verify that the Tab key navigates between email field, password field, Remember me, and Sign in button in logical order. | Login page is loaded. | Tab order follows a logical sequence through interactive elements. | Medium |
| TS_LGN_086 | Verify that the email input field receives focus automatically when the login page loads. | Login page has just loaded. | Needs clarification: PRD does not specify auto-focus behavior. | Low |
| TS_LGN_087 | Verify that the login page renders correctly on mobile screen sizes (responsive design). | Login page accessed from a mobile viewport. | All elements are visible, usable, and properly laid out on mobile screen. | Medium |
| TS_LGN_088 | Verify that the login page renders correctly on tablet screen sizes (responsive design). | Login page accessed from a tablet viewport. | All elements are visible, usable, and properly laid out on tablet screen. | Medium |

## Login – Compatibility

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_089 | Verify that the login page renders and functions correctly on Google Chrome. | Google Chrome browser is available. | Login page loads and all features work correctly on Chrome. | High |
| TS_LGN_090 | Verify that the login page renders and functions correctly on Mozilla Firefox. | Mozilla Firefox browser is available. | Login page loads and all features work correctly on Firefox. | Medium |
| TS_LGN_091 | Verify that the login page renders and functions correctly on Microsoft Edge. | Microsoft Edge browser is available. | Login page loads and all features work correctly on Edge. | Medium |
| TS_LGN_092 | Verify that the login page renders and functions correctly on Safari. | Safari browser is available (macOS/iOS). | Login page loads and all features work correctly on Safari. | Medium |

## Login – Performance

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_093 | Verify that the login page loads completely within acceptable time under normal network conditions. | Stable internet connection. | Needs clarification: PRD specifies 2-second for dashboard, but does not explicitly specify login page load time. | High |
| TS_LGN_094 | Verify that the login API responds within acceptable latency under normal load. | Login request is submitted. | Needs clarification: PRD does not specify login API response time threshold. | Medium |

## Login – Data Privacy

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_095 | Verify that user credentials are transmitted securely (encrypted via TLS) during login. | User submits login form. | Credentials are encrypted in transit via HTTPS/TLS. (PRD: Encryption in transit (TLS)) | High |
| TS_LGN_096 | Verify that the login page handles user consent tracking in compliance with GDPR. | Login page is loaded for a user in a GDPR-applicable region. | Needs clarification: PRD mentions GDPR consent tracking but does not specify if it applies to the login page specifically. | Medium |

## Login – Availability

| Test Scenario ID | Test Scenario | Pre-Condition | Expected Result | Priority |
|---|---|---|---|---|
| TS_LGN_097 | Verify that the login page is consistently accessible as part of the 99.9% uptime SLA commitment. | Login page URL is accessed at various times. | Login page is available and functional. (PRD: 99.9% uptime SLA) | High |

---

## Summary by Module

| Module | Total | High | Medium | Low |
|---|---|---|---|---|
| Login – UI | 15 | 4 | 7 | 4 |
| Login – Email/Password | 21 | 9 | 6 | 6 |
| Login – Password Field | 4 | 1 | 2 | 1 |
| Login – Remember Me | 3 |  | 2 | 1 |
| Login – Forgot Password | 4 | 2 | 2 |  |
| Login – Google Sign-In | 4 | 2 | 2 |  |
| Login – SSO | 4 | 3 | 1 |  |
| Login – Passkey | 4 | 2 | 2 |  |
| Login – 2FA | 7 | 4 | 1 | 2 |
| Login – Security | 10 | 9 | 1 |  |
| Login – Session | 3 |  | 3 |  |
| Login – RBAC | 2 | 2 |  |  |
| Login – Navigation | 3 |  | 2 | 1 |
| Login – Usability | 4 |  | 3 | 1 |
| Login – Compatibility | 4 | 1 | 3 |  |
| Login – Performance | 2 | 1 | 1 |  |
| Login – Data Privacy | 2 | 1 | 1 |  |
| Login – Availability | 1 | 1 |  |  |
| TOTAL | 97 | 42 | 39 | 16 |

---

## Needs Clarification

| Scenario ID | Module | Clarification Needed |
|---|---|---|
| TS_LGN_019 | Login – Email/Password | System prevents login and displays a validation indication. (Exact message: Needs clarification — PRD does not specify) |
| TS_LGN_020 | Login – Email/Password | System prevents login and displays a validation indication. (Exact message: Needs clarification — PRD does not specify) |
| TS_LGN_021 | Login – Email/Password | System prevents login and displays a validation indication. (Exact message: Needs clarification — PRD does not specify) |
| TS_LGN_022 | Login – Email/Password | System denies login and displays an error indication. (Exact message: Needs clarification — PRD does not specify) |
| TS_LGN_023 | Login – Email/Password | System denies login and displays an error indication. (Exact message: Needs clarification — PRD does not specify) |
| TS_LGN_027 | Login – Email/Password | Needs clarification: PRD does not specify minimum email length requirements. |
| TS_LGN_028 | Login – Email/Password | Needs clarification: PRD does not specify maximum email length accepted. |
| TS_LGN_029 | Login – Email/Password | Needs clarification: PRD does not specify minimum password length requirements. |
| TS_LGN_030 | Login – Email/Password | Needs clarification: PRD does not specify maximum password length accepted. |
| TS_LGN_031 | Login – Email/Password | Needs clarification: PRD does not specify whether leading/trailing spaces are trimmed. |
| TS_LGN_032 | Login – Email/Password | Needs clarification: PRD does not specify whether leading/trailing spaces are trimmed. |
| TS_LGN_033 | Login – Email/Password | Needs clarification: PRD does not specify whether email comparison is case-insensitive. |
| TS_LGN_040 | Login – Password Field | Needs clarification: PRD does not specify copy prevention for password fields. |
| TS_LGN_043 | Login – Remember Me | Needs clarification: PRD does not specify the session duration for "Remember me". |
| TS_LGN_045 | Login – Forgot Password | System initiates password recovery process (e.g., sends recovery email). (Exact flow: Needs clarification — PRD does not detail the recovery mechanism) |
| TS_LGN_046 | Login – Forgot Password | Needs clarification: PRD does not specify the response for unregistered emails on Forgot Password. |
| TS_LGN_050 | Login – Google Sign-In | User is returned to the VWO login page without error. (Exact behavior: Needs clarification — PRD does not detail cancellation handling) |
| TS_LGN_051 | Login – Google Sign-In | Needs clarification: PRD does not specify behavior for unlinked Google accounts. |
| TS_LGN_054 | Login – SSO | System denies SSO login and displays an appropriate indication. (Exact message: Needs clarification) |
| TS_LGN_055 | Login – SSO | Needs clarification: PRD does not specify fallback behavior when SSO IdP is unavailable. |
| TS_LGN_058 | Login – Passkey | Needs clarification: PRD does not mention passkeys — cancellation behavior unspecified. |
| TS_LGN_059 | Login – Passkey | Needs clarification: PRD does not mention passkeys — unsupported device behavior unspecified. |
| TS_LGN_062 | Login – 2FA | System denies authentication and displays an error indication. (Exact message: Needs clarification — PRD does not specify) |
| TS_LGN_064 | Login – 2FA | Needs clarification: PRD does not specify the expected length of 2FA codes. |
| TS_LGN_065 | Login – 2FA | Needs clarification: PRD does not specify the expected length of 2FA codes. |
| TS_LGN_066 | Login – 2FA | Needs clarification: PRD does not specify lockout policy after failed 2FA attempts. |
| TS_LGN_074 | Login – Security | Error message should be generic and not disclose which field is wrong. (Exact message: Needs clarification — PRD does not specify) |
| TS_LGN_075 | Login – Security | Needs clarification: PRD does not specify account lockout or rate-limiting policy for failed login attempts. |
| TS_LGN_076 | Login – Security | Needs clarification: PRD does not specify whether IP/location-based security checks are enforced. |
| TS_LGN_077 | Login – Session | Needs clarification: PRD does not specify session redirect behavior for authenticated users. |
| TS_LGN_078 | Login – Session | Needs clarification: PRD does not specify session timeout duration. |
| TS_LGN_079 | Login – Session | Needs clarification: PRD does not specify concurrent session policy. |
| TS_LGN_086 | Login – Usability | Needs clarification: PRD does not specify auto-focus behavior. |
| TS_LGN_093 | Login – Performance | Needs clarification: PRD specifies 2-second for dashboard, but does not explicitly specify login page load time. |
| TS_LGN_094 | Login – Performance | Needs clarification: PRD does not specify login API response time threshold. |
| TS_LGN_096 | Login – Data Privacy | Needs clarification: PRD mentions GDPR consent tracking but does not specify if it applies to the login page specifically. |