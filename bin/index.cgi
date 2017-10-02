#!/usr/bin/perl
use strict;
use warnings;

use DBI;
use CGI;
#use CGI::Carp qw(fatalsToBrowser);
use JSON;

my $q = CGI->new;

# Connect to DB  
my $dbname = 'OP_ApptsDemo.db';
my $dsn = "dbi:SQLite:$dbname";
my $user = "";
my $pass = "";

my $dbh = DBI->connect($dsn, $user, $pass, {
                      PrintError => 0,
                      RaiseError => 1,
                      AutoCommit => 1,
                      FetchHashKeyName => 'NAME_lc'
                    });

# Index functions

# Returns hash array of all appointments in table matching search if provided
sub getAppointments {
  my $query = lc(shift);
  my @result = ();

  my $sth = $dbh->prepare("SELECT date, time, description FROM appointments");
  $sth->execute();

  while(my $row = $sth->fetchrow_hashref) {
    # If a search query is included, push to result array if it matches any of the description texts
    if(length($query)) {
      next if lc($row->{'description'}) !~ /$query/;
    }

    push(@result, $row);
  }

  return @result;
}

my @appts = getAppointments($q->param("q")); 
my %resp_body = (
  "data" => \@appts,
  "errors" => ()
);

#Destroy Functions - TODO


#Accept post of new appointment
my $apptdate = $q->param("date");
my $appttime = $q->param("time");
my $apptdesc = $q->param("desc");

if(length($apptdate) && length($appttime) && length($apptdesc)) {

  my $sth = $dbh->prepare("INSERT INTO appointments (date, time, description) VALUES (?,?,?)");
  $sth->execute($apptdate, $appttime, $apptdesc);

} elsif (length($q->param("new-appt-submit"))) {

  my @errors = ("Fields cannot be blank.");
  $resp_body{'errors'} = \@errors;
  
}

# Output JSON response
print "Content-Type: application/json\n\n";
print encode_json \%resp_body;