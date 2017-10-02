#!/usr/bin/perl -T
use warnings;
use strict;

use FindBin;
use lib "$FindBin::Bin/../lib";
use CGI::Carp 'fatalsToBrowser';
use PerlDemo::Appointments;

my $app = PerlDemo::Appointments->new( PARAM => 'client' );
$app->run();