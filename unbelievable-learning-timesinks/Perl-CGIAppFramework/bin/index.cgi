#!/usr/bin/perl -T

use FindBin;
use lib "$FindBin::Bin/../lib";
use CGI::Carp 'fatalsToBrowser';

use warnings;
use strict;
use PerlDemo::Appointments;

print "Content-type: text/html\n\n";
print "Hello, World.";

# my $app = PerlDemo::Appointments->new( PARAM => 'client' );
# $app->run();