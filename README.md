# Pad Thai

A pad thai restaurant review tracker.

## Repo structure

```
padthai/
├── index.html
├── style.css
├── main.js
├── data.csv              ← all your data lives here
├── images/               ← upload full-res photos here
│   └── thumbnails/       ← auto-generated, do not edit manually
└── .github/
    └── workflows/
        └── thumbnails.yml
```

## Adding a new entry

1. Upload your photo to `images/` via the GitHub web UI
2. Note the exact filename (e.g. `somplace-bangkok.jpg`)
3. Edit `data.csv` — add a new row at the bottom:
   ```
   "Restaurant Name","somplace-bangkok.jpg","123 Main St, City","8.5","2025-06-01","-0.5, a bit soggy","1, great balance","0.5, generous","1, complex and rich","0, standard chicken","-0.5, noisy","0.5, fair price","1, would return"
   ```
4. Commit both changes. GitHub Actions will auto-generate the thumbnail within ~2 minutes.

## CSV tips

- Wrap any field containing a comma in double quotes: `"value, with comma"`
- Date format: `YYYY-MM-DD` (enables correct date sorting)
- Photo field: filename only, not the full path
- Leave a field blank if you have nothing to say: just leave it empty between commas

## Columns

| Column | Format |
|---|---|
| Name | Restaurant name |
| Photo | Image filename (e.g. `place.jpg`) |
| Location | Full address |
| Rating | Decimal number (e.g. `8.5`) |
| Review Date | `YYYY-MM-DD` |
| Noodles | e.g. `-0.5, too soft` |
| Sauce | e.g. `1, perfectly balanced` |
| Toppings | e.g. `0.5, generous but pedestrian` |
| Flavor | free text with optional score prefix |
| Protein | free text with optional score prefix |
| Atmosphere | free text with optional score prefix |
| Value | free text with optional score prefix |
| Wow Factor | free text with optional score prefix |
