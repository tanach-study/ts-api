// helper function to do a regex test against a given email
function isValidEmail(email) {
  // regex for testing an email obtained from http://www.regular-expressions.info/email.html on 11/25/2016
  // allows for all valid emails - including those on subdomains of subdomains, up to the maximum SMTP supports
  // for more info, see above article
  const emailRegex = new RegExp(/^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i);
  // more basic regex obtained from the same article as the previous one
  // const emailRegex = new RegExp(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return emailRegex.test(email);
}

function teacherComparator(t1, t2) {
  if (t1.lname > t2.lname) {
    return 1;
  }
  if (t1.lname < t2.lname) {
    return -1;
  }
  if (t1.fname > t2.fname) {
    return 1;
  }
  if (t1.fname < t2.fname) {
    return -1;
  }
  if (t1.mname > t2.mname) {
    return 1;
  }
  if (t1.mname < t2.mname) {
    return -1;
  }
  return 0;
}

function perakimComparator(a, b) {
  if (a.division_sequence < b.division_sequence) {
    return -1;
  }
  if (a.division_sequence > b.division_sequence) {
    return 1;
  }
  if (a.segment_sequence < b.segment_sequence) {
    return -1;
  }
  if (a.segment_sequence > b.segment_sequence) {
    return 1;
  }
  if (a.section_sequence < b.section_sequence) {
    return -1;
  }
  if (a.section_sequence > b.section_sequence) {
    return 1;
  }
  if (a.unit_sequence < b.unit_sequence) {
    return -1;
  }
  if (a.unit_sequence > b.unit_sequence) {
    return 1;
  }
  if (a.part_sequence < b.part_sequence) {
    return -1;
  }
  if (a.part_sequence > b.part_sequence) {
    return 1;
  }
  return 0;
}

module.exports = {
  isValidEmail,
  teacherComparator,
  perakimComparator,
};
