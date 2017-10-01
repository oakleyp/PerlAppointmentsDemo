# This file is no longer used, just committing to show horrible time sinkage into the wrong way of going about this.
#!/usr/bin/perl -T

package PerlDemo::Appointments;

use strict;
use warnings;
use MIME::Lite;    #load any extra modules needed
use Date::Calc qw(Today);

use base 'CGI::Application';
use CGI::Application::Plugin::FillInForm(qw/fill_form/);
use CGI::Application::Plugin::Config::Simple;
use CGI::Application::Plugin::Redirect;
use CGI::Application::Plugin::Session;
use CGI::Application::Plugin::DBH (qw/dbh_config dbh/);
use HTML::Template;

# Start CGI::APP 
sub cgiapp_init {
  my $self = shift;
    
  # Set Paths
  #$self->config_file('appointments.conf');
  $self->tmpl_path( './' );
                        
  # Session
  $self->session_config( DEFAULT_EXPIRY => '+8h');
                        
  # Connect to DB  
  my $dbname = 'OP_ApptsDemo.db';
  my $dsn = "dbi:SQLite:$dbname";
  my $user = "";
  my $pass = "";

  $self->dbh_config($dsn, $user, $pass, {
                      PrintError => 0,
                      RaiseError => 1,
                      AutoCommit => 1,
                      FetchHashKeyName => 'NAME_lc'
                    });
}

sub validate {
   my $self = shift;
   my $to_check = shift;
   
   if ( $to_check !~ /^([\w ]+)$/ ) {
      return ( $to_check, " has invalid characters or is blank" );
   } else {
      return $1;
   }
}

sub setup {
   my $self = shift;
   $self->start_mode('d');         #if no run mode, use 'd'
   $self->mode_param('rm');
   $self->run_modes(
      'd'         => 'display',
      's'         => 'save_form'
   );
}

sub display {
   my $self = shift;
   
    my $template = $self->load_tmpl( '../index.tmpl', die_on_bad_params => 0);
                                      
   $template->param( today => sprintf( '%4d-%02d-%02d', Today() ) );                               

   return $template->output();
}

sub save_form {
   my $self = shift;
   
   my ( %sql, @errors, $error, $fifvalues );
   
   ($sql{'date'}, $error ) = $self->validate( $self->query->param('date') );
      if ( $error ) { push @errors, ( { 'error' => 'Date'.$error } ); }
   ($sql{'time'}, $error ) = $self->validate( $self->query->param('address') );
      if ( $error ) { push @errors, ( { 'error' => 'Time'.$error } ); }
   ($sql{'desc'}, $error ) = $self->validate( $self->query->param('city') );
      if ( $error ) { push @errors, ( { 'error' => 'Description'.$error } ); }

  my $template = $self->load_tmpl( 'index.tmpl', die_on_bad_params => 0 );

   #if there are errors, return the form with original input and error messages
   if ( @errors ) { 
   
      $template->param(errors => \@errors, today => sprintf( '%4d-%02d-%02d', Today() ));
   
      for my $key ( keys %sql ) { 
         $fifvalues->{$key} = $sql{$key}; #assign fill-in-form values
      }

      return $self->fill_form( \$template->output, $fifvalues );
      
   } else {
   
      $self->record(\%sql);  #record the input
      
      return $template->output
   }   

}

sub record {
   my $self = shift;
   my $sql  = shift;
   my %sql  = %{ $sql };

    #we use CAP::DBH to connect to the DB and execute our SQL statement
   my $stmt = 'INSERT INTO appointments (' . join(',', keys %sql) . ') 
                  VALUES (' . join(',', ('?') x keys %sql) . ')';
   $self->dbh->do($stmt, undef, values %sql);   
}  
1;
