# Perakim Model

This is a sample schema definition for the perakim collection in the database.

```json
{
  "division": "string",
  "division_name": "string",
  "division_title": "string",

  "segment": "string",
  "segment_name": "string",
  "segment_title": "string",
  
  "section": "string",
  "section_name": "string",
  "section_title": "string",
  
  "unit": "string",
  "unit_name": "string",
  "unit_title": "string",
  
  "part": "string",
  "part_name": "string",
  "part_title": "string",

  "series": "string",
  "series_name": "string",

  "audio_url": "string",

  "teacher_title": "string",
  "teacher_fname": "string",
  "teacher_mname": "string|null",
  "teacher_lname": "string",
  "teacher_short_bio": "string",
  "teacher_long_bio": "string",
  "teacher_image_url": "string",
  
  "teamim": [
    {    
      "reader_title": "string",
      "reader_fname": "string",
      "reader_mname": "string|null",
      "reader_lname": "string",
      "reader_short_bio": "string",
      "reader_long_bio": "string",
      "reader_image_url": "string",
      "audio_url": "string"
    }
  ]
  

}
```

# Structure:

division -> segment -> section -> unit -> part
series

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

# URL Structure

With this kind of database model, we can have URL's structured as the program name (tanach-study, mishna-study, etc), foollowed by an arbitrary number of parts after it. The API can then validate which pieces it needs in order to service the request.

A different implementation of the API would be to add a route for each program and have different model handlers for each program. Thus, the first function in the route pipeline would be to build the query object, and the next would be to execute it.

/tanach-study/neviim-rishonim/yehoshua/24

/tanach-study/neviim-aharonim/yehezkel/23/b

/parasha-study/bereshit/noah/3

/haftara-study/bereshit/noah/3

/tanach-study/torah/bereshit/noah/3

/mishna-study/zeraim/berachot/1/2

/tehillim-study/137

/moadim-study/pesah/torah/1

# Per-Program Structure Breakdown

This section details what kind of data each program should include for each division.

## Tanach Study

Division: part (torah, neviim-rishonim, neviim-aharonim, tere-asar, ketuvim)
Segment: null
Section: sefer name (bereshit, shemot, yehoshua, shofetim, shemuel-1...)
Unit: perek number or parasha name
Part: part number, letter or mefaresh name
Series: peshat

## Parasha Study

Division: torah
Segment: null
Section: sefer name (bereshit, shemot, vayikra, bemidbar, devarim)
Unit: parasha name
Part: part number or mefaresh name
Series: peshat or perush

## Examples

division -> segment -> section -> unit -> part

* neviim-rishonim -> null -> yehoshua -> 1 -> null
* neviim-rishonim -> null -> yehoshua -> 5 -> b
* parasha -> bereshit -> noah -> null -> 3
* haftara -> bereshit -> noah -> null -> 3
* mishna -> zeraim -> berachot -> 1 -> 1
* tehillim -> null -> 137 -> null
* moadim -> null -> pesah -> torah -> 1

