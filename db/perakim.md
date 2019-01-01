# Perakim Model

This is a sample schema definition for the perakim collection in the database.

```json
{
  "_id": "Mongo ID",
  "teacher_bio": "string",
  "teacher_title": "string",
  "teacher_fname": "string",
  "teacher_mname": "string|null",
  "teacher_lname": "string",
  "reader_bio": "string|null",
  "reader_title": "string|null",
  "reader_fname": "string|null",
  "reader_mname": "string|null",
  "reader_lname": "string|null",
  "part_id": "number",
  "part_name": "string",
  "is_many_parts": "boolean",
  "parts_breakdown": "array|null",
  "perek_id": "number",
  "teacher_id": "number",
  "reader_id": "number|null",
  "book_id": "number",
  "book_num_chapters": "number",
  "book_name_pretty_eng": "string",
  "book_name": "string",
  "prev_book_id": null,
  "prev_book_name": null,
  "prev_book_num_chapters": null,
  "next_book_id": 2,
  "next_book_name": "shofetim",
  "next_book_num_chapters": 21,
  "sefer": "yehoshua"
}
```

# Structure:

division -> segment -> section -> unit -> part

## Divisions

* torah
* neviim-rishonim
* neviim-aharonim
* tere-asar
* ketuvim
* parasha
* mishna
* haftara

## Sections

### torah

* bereshit
* shemot
* vayikra
* bemidbar
* devarim

### neviim-rishonim

* yehoshua
* shofetim
* shemuel-1
* shemuel-2
* melachim-1
* melachim-2

### neviim-aharonim

* yeshayahu
* yirmiyahu
* yehezkel

### tere-asar

* hoshea
* yoel
* amos
* ovadia
* yonah
* michah
* nahum
* habakuk
* sephania
* hagai
* zecharia
* malachi

### ketuvim

* divre-hayamim-1
* divre-hayamim-2
* tehillim
* mishle
* iyov
* shir-hashirim
* ruth
* eichah
* kohelet
* esther
* daniel
* ezra
* nehemya

### mishna

* zeraim
* moed
* nashim
* nezikin
* kadashim
* taharot

## Units

Units can be one of:

* perek
* parasha
* 

## Examples

division -> segment -> section -> unit -> part

* neviim-rishonim -> none -> yehoshua -> 1
* parasha -> bereshit -> noah -> null -> 3
* haftara -> bereshit -> noah -> null -> 3
* mishna -> zeraim -> berachot -> 1 -> 1
* tehillim -> none -> 137 -> none
* madim -> none -> pesah -> torah -> 1
