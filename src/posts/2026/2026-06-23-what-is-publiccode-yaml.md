---
title: "What is publiccode.yml?"
description: "Exploring the publiccode.yml standard that helps public administrations make their software discoverable and reusable."
date: 2026-06-24
---

**TLDR:** `publiccode.yml` is a metadata standard in YAML format that describes software created by or for public administrations. Placed in the root of a repository, it makes public software easily discoverable and reusable by both humans and machines.

---

Last week I attended a meetup of [developer.overheid.nl](https://developer.overheid.nl/) and during one of the sessions I saw `publiccode.yml` files in several repositories. Since I didn't know what `publiccode.yml` was, I decided to look into it.

## What is publiccode.yml?

My initial thought was that `publiccode.yml` could be a way to standardize metadata for public open source software projects, making them more discoverable. But it turned out to be slightly different from what I expected...

`publiccode.yml` is a **metadata standard** designed specifically for software developed by or for **public administrations**. It's a YAML file that is placed in the root directory of the repository. The file contains structured information about the software project, making it easy for both humans and machines to understand what the software does, who maintains it, and whether it might be suitable for reuse in other contexts.

The standard is developed as an open collaboration across public administrations and is governed by the [publiccode.yml Working Group Charter](https://github.com/publiccodeyml/publiccode.yml/blob/main/governance/charter.md). A steering committee consisting of public administration representatives oversees its development to ensure it aligns with the needs of public agencies.

`publiccode.yml` is designed to be:

- **Human-readable** - Easy for civil servants, developers, and decision-makers to understand
- **Machine-readable** - Structured data that can be automatically processed and indexed
- **Platform-agnostic** - Works regardless of whether you use GitHub, GitLab, Codeberg, or any other Git platform
- **Extensible** - Can grow as the project evolves
- **International** - Designed for global use with support for country-specific extensions

## The structure of a publiccode.yml file

A `publiccode.yml` file contains various sections that describe different aspects of the software. 

Here's a real example of a `publiccode.yml` file that is used to describe the [NL Wallet](https://github.com/MinBZK/nl-wallet) project:

```yaml
publiccodeYmlVersion: "0.5.0"

name: NL Wallet
url: https://github.com/MinBZK/nl-wallet
landingURL: https://minbzk.github.io/nl-wallet/
softwareType: standalone/mobile
developmentStatus: development

platforms:
  - android
  - ios

categories:
  - identity-management
  - digital-citizenship

description:
  nl:
    shortDescription: >-
      Een veilige digitale wallet voor Nederlandse burgers om persoonlijke identiteitsdocumenten en -gegevens op te
      slaan en te delen.
    longDescription: |
      NL Wallet is een veilige app op je telefoon waarmee je belangrijke
      persoonlijke informatie op één plek kunt bewaren, zoals je naam, leeftijd
      of officiële documenten zoals je identiteitskaart of rijbewijs. Met de
      wallet kan je eenvoudig bewijzen wie je bent, of alleen de informatie
      tonen die een dienst nodig heeft.

      Voorbeelden van gebruik:
      - Bewijzen dat je ouder dan 18 bent zonder je volledige geboortedatum te
        delen.
      - Je identiteit bevestigen bij contacten met de overheid.
      - Een digitale versie van een diploma delen bij een sollicitatie.

      NL Wallet biedt gemak, sterkere beveiliging en bescherming tegen
      identiteitsfraude, en geeft individuen meer controle over hun eigen
      gegevens. Documenten zijn moeilijker te vervalsen omdat ze digitaal
      ondertekend zijn, en de wallet werkt in alle EU-landen.

      De wallet is ook handig voor dienstverleners die identiteit of
      persoonsgegevens moeten controleren: meer vertrouwen, minder gevoelige
      gegevens zelf opslaan, eenvoudigere privacynaleving en snellere processen.

      NL Wallet wordt open en transparant ontwikkeld door het Ministerie van
      Binnenlandse Zaken en Koninkrijksrelaties en is naar verwachting
      beschikbaar voor het publiek in 2027.
    features:
      - Digitale opslag van identiteitsdocumenten
      - Selectieve attribuutdeling (bijv. alleen leeftijdsverificatie)
      - Ondersteuning voor EU Digital Identity Wallet (EUDI)
      - Sterke cryptografische beveiliging van documenten
      - Beschikbaar op Android en iOS

  en:
    shortDescription: >-
      A secure digital wallet for Dutch nationals to store and share personal identity documents and attributes.
    longDescription: |
      NL Wallet is a secure app on your phone that lets you keep important
      personal information in one place, such as your name, age, or official
      documents like your ID card or driving licence. With the wallet, you can
      easily prove who you are, or show only the information a service needs.

      For example:
      - Showing you are over 18 without sharing your full date of birth.
      - Confirming your identity when dealing with the government.
      - Sharing a digital version of a diploma when applying for a job.

      NL Wallet offers convenience, stronger security, and protection against
      identity fraud, while giving individuals greater control over their own
      information. Documents are harder to fake because they are digitally
      signed, and the wallet works across all EU countries.

      NL Wallet also makes things easier and safer for relying parties, which
      are organisations that need to check identity or personal information:
      more trust, less sensitive data to store, easier privacy compliance, and
      faster and smoother processes.

      The app is being developed openly by the Dutch Ministry of the Interior
      and Kingdom Relations (MinBZK) and is expected to be available to the
      public in 2027.
    features:
      - Digital storage of identity documents
      - Selective attribute disclosure (e.g., age verification only)
      - Support for EU Digital Identity Wallet (EUDI)
      - Strong cryptographic document security
      - Available on Android and iOS

legal:
  license: EUPL-1.2
  mainCopyrightOwner: Ministerie van Binnenlandse Zaken en Koninkrijksrelaties

maintenance:
  type: internal
  contacts:
    - name: Ministerie van Binnenlandse Zaken en Koninkrijksrelaties
      email: edi@minbzk.nl

intendedAudience:
  countries:
    - NL

localisation:
  localisationReady: true
  availableLanguages:
    - nl
    - en
```

For the full schema description, see [yml.publiccode.tools](https://yml.publiccode.tools/schema.core.html).

## Why public administrations are using it

The adoption of `publiccode.yml` by public administration organizations is driven by several compelling benefits:

**Enhanced Discoverability:** Without proper metadata, finding relevant open source software can be difficult; publiccode.yml provides a standardized way to describe software, with public administrations like Italy (via [Developers Italia](https://developers.italia.it/)), Germany (via [opencode.de](https://opencode.de)), and the Netherlands (via [developer.overheid.nl](https://developer.overheid.nl)) using it to build comprehensive catalogs.

**Better Decision Making:** It provides clear descriptions, development status, maintenance details, legal information, and technical specifications that allows non-technical stakeholders to quickly assess whether a software project might be suitable for their needs.

**Platform Independence:** Since `publiccode.yml` is a file in the repository, it's part of the codebase and moves with it wherever you host your code, unlike platform-specific metadata.

**Standardization and Interoperability:** It provides a common language for public administrations worldwide to describe their software, while allowing for country-specific extensions.

**Support for Open Source Policies:** It enables governments to find existing solutions before building new ones, provides the information needed to assess software quality, and supports transparency in software procurement.

**Facilitating Collaboration:** It makes it easier for different administrations to collaborate by clearly identifying maintainers, project status, and technical details.

## Adoption Across Europe

The `publiccode.yml` standard is gaining traction across Europe:

- **Italy**: Mandatory for all public software, with a [national catalog](https://developers.italia.it/) built on it
- **Netherlands**: Recommended standard for open source projects on [developer.overheid.nl](https://developer.overheid.nl)
- **Germany**: Used by [opencode.de](https://opencode.de), the national open source registry
- **European Union**: Recognized by the [Open Source Observatory (OSOR)](https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor) and included in the [EU Open Source Solutions Catalogue](https://interoperable-europe.ec.europa.eu/eu-oss-catalogue)

## Tooling and Ecosystem

A growing ecosystem of tools supports the `publiccode.yml` standard, developed alongside the specification as reference implementations:

- **[publiccode-parser-go](https://github.com/italia/publiccode-parser-go)** - Go parser and validator. Reference implementation of the specification.
- **[publiccode-parser-php](https://github.com/bfabio/publiccode-parser-php)** - PHP library for parsing and validation using the reference implementation via FFI.
- **[publiccode-crawler](https://github.com/italia/publiccode-crawler)** - Crawler to discover and collect descriptor files for catalogs.
- **[software-catalog-api](https://github.com/italia/developers-italia-api)** - RESTful API powering software catalogs for public administrations, used to store, query and expose all catalog data about FLOSS solutions.
- **[publiccode-api-client](https://github.com/bfabio/publiccode-api-client)** - Convenience command-line client to query the catalog API. (*alpha*)
- **[publiccode-parser-action](https://github.com/italia/publiccode-parser-action)** - GitHub Action for validation in GitHub pipelines.
- **[publiccode-parser-gitlab-ci](https://github.com/italia/publiccode-parser-gitlab-ci)** - GitLab CI integration for validation
- **[publiccode-validator-api](https://github.com/italia/publiccode-validator-api)** - Simple RESTful API for validating publiccode.yml files, returning errors and warnings.
- **[publiccode-issueopener](https://github.com/italia/publiccode-issueopener)** - Opens GitHub issues to repos in a software catalog with invalid publiccode.yml files.
- **[JSON Schema on SchemaStore](https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/publiccode.json)** - JSON Schema definition mainly used by editors and IDEs for coarse validation and autocompletion.

## Conclusion

I'm a big fan of open source and open standards, and I think `publiccode.yml` is a great example of both. It provides a simple yet powerful way to describe software projects in a standardized format, making them more discoverable and reusable across public administrations.

I hope more public administrations and FOSS developers adopt the standard, and that it continues to evolve to meet the needs of the community. [Version 0.7](https://github.com/publiccodeyml/publiccode.yml/discussions/327) was just released today and the maintainers already are working on a [1.0 release candidate](https://github.com/publiccodeyml/publiccode.yml/tree/1.0-rc).

If you're involved in public sector software development, I encourage you to explore `publiccode.yml` and consider using it in your projects.

---

## References

- [publiccode.yml Standard Website](https://yml.publiccode.tools/)
- [GitHub Repository](https://github.com/publiccodeyml/publiccode.yml)
- [publiccode.yml standard in the Dutch government developer portal](https://developer.overheid.nl/kennisbank/open-source/standaarden/publiccode-yml)
- [Interoperable Europe - publiccode.yml Standard](https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor/publiccodeyml-standard)
- [publiccode.yml Editor](https://publiccode-editor.developers.italia.it/)
- [Italy's Developers Portal](https://developers.italia.it/)
- [German opencode.de Registry](https://opencode.de)
