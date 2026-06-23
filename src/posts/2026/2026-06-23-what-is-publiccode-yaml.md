---
title: "What is publiccode.yaml?"
description: "Exploring the publiccode.yml standard that helps public administrations make their software discoverable and reusable."
date: 2026-06-23
---

**TLDR:** `publiccode.yaml` is a metadata standard in YAML format that describes software created by or for public administrations. Placed in the root of a repository, it makes public software easily discoverable and reusable by both humans and machines.

---

Last week I attended a meetup of [developer.overheid.nl](https://developer.overheid.nl/) and during one of the sessions I saw `publiccode.yaml` mentioned in several repositories. Since I didn't know what `publiccode.yaml` was, I decided to look into it.

## What is publiccode.yaml?

My initial thought was that `publiccode.yaml` could be a way to standardize metadata for public open source software projects, making them more discoverable and reusable. But it turned out to be slightly different from what I expected.

`publiccode.yaml` is a **metadata standard** designed specifically for software developed by or for **public administrations**. It's a YAML file that is placed in the root directory of the repository. The file contains structured information about the software project, making it easy for both humans and machines to understand what the software does, who maintains it, and whether it might be suitable for reuse in other contexts.

The standard was developed as an open collaboration and is maintained by the [publiccodeyml community](https://github.com/publiccodeyml/publiccode.yml) on GitHub. It's designed to be:

- **Human-readable** - Easy for civil servants, developers, and decision-makers to understand
- **Machine-readable** - Structured data that can be automatically processed and indexed
- **Platform-agnostic** - Works regardless of whether you use GitHub, GitLab, Codeberg, or any other Git platform
- **Extensible** - Can grow as the project evolves
- **International** - Designed for global use with support for country-specific extensions

## The structure of a publiccode.yaml file

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

For the full schema description, see [yml.publiccode.tools](https://yml.publiccode.tools/schema.core.html).

## Why public administrations are using it

The adoption of `publiccode.yaml` by public administration organizations is driven by several compelling benefits:

**Enhanced Discoverability:** Without proper metadata, finding relevant open source software can be difficult; publiccode.yaml provides a standardized way to describe software, with public administrations like Italy (via [Developers Italia](https://developers.italia.it/)), Germany (via [opencode.de](https://opencode.de)), and the Netherlands (via [developer.overheid.nl](https://developer.overheid.nl)) using it to build comprehensive catalogs.

**Better Decision Making:** It provides comprehensive information—clear descriptions, development status, maintenance details, legal information, and technical specifications—that allows non-technical stakeholders to quickly assess whether a software project might be suitable for their needs.

**Platform Independence:** Since publiccode.yaml is a file in the repository, it's part of the codebase and moves with it wherever you host your code, unlike platform-specific metadata.

**Standardization and Interoperability:** It provides a common language for public administrations worldwide to describe their software, while allowing for country-specific extensions.

**Support for Open Source Policies:** It enables governments to find existing solutions before building new ones, provides the information needed to assess software quality, and supports transparency in software procurement.

**Facilitating Collaboration:** It makes it easier for different administrations to collaborate by clearly identifying maintainers, project status, and technical details.

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
