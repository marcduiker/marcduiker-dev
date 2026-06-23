---
title: "What is publiccode.yaml?"
description: "Exploring the publiccode.yml standard that helps public administrations make their software discoverable and reusable."
date: 2026-06-23
---

**TLDR:** `publiccode.yaml` (or `publiccode.yml`) is a metadata standard in YAML format that describes software created by or for public administrations. Placed in the root of a repository, it makes public software easily discoverable and reusable by both humans and machines. It's mandatory for all public software in Italy and is gaining adoption across Europe, including in the Netherlands and Germany.

---

Public administrations around the world create valuable software every day. However, the reuse of this software is often limited, not because of technical barriers, but because of poor discoverability and a lack of understanding about whether a project fits another administration's context. This is where `publiccode.yaml` comes in.

## What is publiccode.yaml?

`publiccode.yaml` is a **metadata standard** designed specifically for software developed by or for public administrations. It's a simple YAML file that you place in the root directory of your repository. This file contains structured information about your software project, making it easy for both humans and machines to understand what the software does, who maintains it, and whether it might be suitable for reuse in other contexts.

The standard was developed as an open collaboration and is maintained by the [publiccodeyml community](https://github.com/publiccodeyml/publiccode.yml) on GitHub. It's designed to be:

- **Human-readable** - Easy for civil servants, developers, and decision-makers to understand
- **Machine-readable** - Structured data that can be automatically processed and indexed
- **Platform-agnostic** - Works regardless of whether you use GitHub, GitLab, Codeberg, or any other Git platform
- **Extensible** - Can grow as your project evolves
- **International** - Designed for global use with support for country-specific extensions

## The Structure of a publiccode.yaml File

A `publiccode.yaml` file contains various sections that describe different aspects of the software. Here's what a typical file looks like:

```yaml
publiccodeYmlVersion: "0.5"
name: My Government Application
url: "https://github.com/myorg/myapp.git"

softwareType: standalone/web
platforms:
  - web

developmentStatus: stable

description:
  en:
    shortDescription: A web application for citizen services
    longDescription: |
      This application allows citizens to apply for various government services online.
      It includes features for authentication, form submission, and document upload.
    features:
      - Online form submission
      - Document upload
      - User authentication

legal:
  license: EUPL-1.2
  mainCopyrightOwner: My Government Agency

maintenance:
  type: internal
  contacts:
    - name: John Doe
      email: john.doe@agency.gov
      affiliation: My Government Agency

localisation:
  localisationReady: true
  availableLanguages:
    - en
    - nl

intendedAudience:
  countries:
    - NL
  scope:
    - government
```

### Core Sections

The standard defines several key sections:

- **`publiccodeYmlVersion`** - The version of the publiccode.yml specification being used
- **`name`** - The name of the project or product
- **`url`** - The URL to the source code repository
- **`landingURL`** - The URL to the production/running instance (optional)
- **`softwareType`** - The type of software (e.g., standalone/web, standalone/desktop, library, etc.)
- **`platforms`** - The platforms on which the software is intended to run (e.g., web, windows, linux, ios, android)
- **`developmentStatus`** - The current development state (concept, development, beta, stable, obsolete, deprecated)
- **`description`** - Detailed description of the project in one or more languages, including short description, long description, and features
- **`legal`** - Legal information including license (using SPDX identifiers) and copyright owner
- **`maintenance`** - Information about who maintains the software and how
- **`localisation`** - Information about available languages and localization readiness
- **`intendedAudience`** - The target audience including countries and scope (e.g., government, education, healthcare)
- **`categories`** - Tags that describe what the software does, from a predefined list
- **`dependencies`** - Information about the software's dependencies
- **`keywords`** - Additional keywords for better discoverability

## Why Public Administrations Are Using It

The adoption of `publiccode.yaml` by public administration organizations is driven by several compelling benefits:

### 1. Enhanced Discoverability

Without proper metadata, finding relevant open source software from public administrations can be like looking for a needle in a haystack. `publiccode.yaml` provides a standardized way to describe software, making it easy for search engines and catalogs to index and retrieve relevant projects.

Public administrations can crawl repositories looking for `publiccode.yaml` files and build comprehensive catalogs of available software. For example:

- **Italy**: The [Developers Italia](https://developers.italia.it/) portal uses publiccode.yaml to build the national software catalog
- **Germany**: [opencode.de](https://opencode.de) is the German registry of open source for public administration
- **Netherlands**: [developer.overheid.nl](https://developer.overheid.nl) uses it for their open source catalog

### 2. Better Decision Making

When evaluating whether to reuse existing software or build something new, decision-makers need comprehensive information. `publiccode.yaml` provides:

- **Clear description** of what the software does
- **Development status** to assess maturity and stability
- **Maintenance information** to understand support arrangements
- **Legal information** to verify compliance with licensing requirements
- **Technical details** like platforms and dependencies

This allows non-technical stakeholders to quickly assess whether a software project might be suitable for their needs.

### 3. Platform Independence

Many Git hosting platforms (GitHub, GitLab, etc.) have their own ways of storing project metadata. The problem is that this metadata doesn't travel with the code when you migrate to a different platform. Since `publiccode.yaml` is a file in your repository, it's part of your codebase and moves with it wherever you host your code.

### 4. Standardization and Interoperability

Before `publiccode.yaml`, different governments and organizations used various formats and approaches to describe their software. This lack of standardization made it difficult to share and discover software across borders. The standard provides a common language that public administrations worldwide can use to describe their software.

The standard is designed to be **internationally interoperable** while allowing for **country-specific extensions**. Each country can define additional sections that are relevant to their local context, such as compliance with local laws and regulations.

### 5. Support for Open Source Policies

Many governments have policies that encourage or mandate the reuse of open source software. `publiccode.yaml` supports these policies by:

- Making it easier to find existing solutions before building new ones
- Providing the information needed to assess software quality and suitability
- Enabling the creation of national and international software catalogs
- Supporting transparency and accountability in software procurement

### 6. Facilitating Collaboration

By providing clear information about who maintains the software and how to contact them, `publiccode.yaml` makes it easier for different administrations to collaborate. Potential contributors can quickly identify:

- Who to contact for questions or contributions
- Whether the project is actively maintained
- What the project's development status is
- What programming languages and platforms are used

## Adoption Across Europe

The `publiccode.yaml` standard is gaining significant traction across Europe:

- **Italy**: Mandatory for all public software, with a [national catalog](https://developers.italia.it/) built on it
- **Netherlands**: Recommended standard for open source projects on [developer.overheid.nl](https://developer.overheid.nl)
- **Germany**: Used by [opencode.de](https://opencode.de), the national open source registry
- **European Union**: Recognized by the [Open Source Observatory (OSOR)](https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor) and included in the [EU Open Source Solutions Catalogue](https://interoperable-europe.ec.europa.eu/eu-oss-catalogue)

The standard is also being considered by other countries and is designed to support international collaboration on public sector software.

## Tooling and Ecosystem

A growing ecosystem of tools supports the `publiccode.yaml` standard:

- **[publiccode-parser-go](https://github.com/italia/publiccode-parser-go)** - Reference Go parser and validator
- **[publiccode-crawler](https://github.com/italia/publiccode-crawler)** - Crawls repositories to discover and collect descriptor files
- **[publiccode-editor](https://publiccode-editor.developers.italia.it/)** - User-friendly web editor for creating and validating publiccode.yaml files
- **[publiccode-parser-action](https://github.com/italia/publiccode-parser-action)** - GitHub Action for validation
- **[JSON Schema on SchemaStore](https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/publiccode.json)** - For IDE support and validation

There are also various country-specific implementations and tools that build on the standard.

## Getting Started with publiccode.yaml

Adding `publiccode.yaml` to your project is straightforward:

1. **Create the file**: Add a `publiccode.yaml` (or `publiccode.yml`) file to the root of your repository
2. **Fill in the metadata**: Start with the required fields and add more as your project matures
3. **Validate**: Use one of the available validators to check your file
4. **Publish**: Commit the file to your repository

You can start with a minimal file and expand it as your project evolves. The standard is designed to be useful from day one while being able to grow with your project.

### Minimal Example

```yaml
publiccodeYmlVersion: "0.5"
name: My Project
url: "https://github.com/myorg/myproject.git"
developmentStatus: development
softwareType: standalone/web
```

### Using the Editor

For a more guided experience, you can use the [publiccode.yml editor](https://publiccode-editor.developers.italia.it/), which provides a web interface for creating and validating your file.

## Conclusion

`publiccode.yaml` is more than just a metadata file—it's a **catalyst for change** in how public administrations develop, share, and reuse software. By providing a standardized, machine-readable way to describe public software, it addresses the key barriers to software reuse: discoverability and understanding.

As more public administrations adopt the standard, we're seeing the emergence of truly interoperable software ecosystems where solutions can be discovered and reused across organizational and national boundaries. This not only saves money by avoiding duplicate development but also leads to better software through wider use and contribution.

Whether you're a developer working in the public sector, a civil servant responsible for software procurement, or simply someone interested in open source and government transparency, `publiccode.yaml` is a standard worth understanding and adopting.

---

## References

- [publiccode.yml Standard Website](https://yml.publiccode.tools/)
- [GitHub Repository](https://github.com/publiccodeyml/publiccode.yml)
- [Developer.overheid.nl - publiccode.yml](https://developer.overheid.nl/kennisbank/open-source/standaarden/publiccode-yml)
- [Interoperable Europe - publiccode.yml Standard](https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor/publiccodeyml-standard)
- [publiccode.yml Editor](https://publiccode-editor.developers.italia.it/)
- [Italy's Developers Portal](https://developers.italia.it/)
- [German opencode.de Registry](https://opencode.de)
