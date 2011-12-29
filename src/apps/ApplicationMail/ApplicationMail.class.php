<?php
/*!
 * @file
 * Contains ApplicationMail Class
 * @author Anders Evenrud <andersevenrud@gmail.com>
 * @license GPLv3 (see http://www.gnu.org/licenses/gpl-3.0.txt)
 * @created 2011-05-23
 */

/**
 * ApplicationMail Class
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @package OSjs.Applications
 * @class
 */
class ApplicationMail
  extends Application
{

  /**
   * Create a new instance
   */
  public function __construct() {
    parent::__construct();
  }

  public static function Event($uuid, $action, Array $args) {
    $result = false;

    if ( !class_exists("IMAP") ) {
      require PATH_PROJECT_LIB . "/IMAP.php";
    }

    $host     = "";
    $username = "";
    $password = "";
    if ( isset($args['account']) ) {
      $host       = $args['account']['host'];
      $username   = $args['account']['username'];
      $password   = $args['account']['password'];
    }

    $folder   = isset($args['folder']) ? $args['folder'] : "INBOX";

    try {
      if ( $imap = IMAP::create($host, $username, $password, $folder) ) {
        if ( $action == "account" ) {
          if ( $boxes = $imap->getMailboxes() ) {
            $result = Array();
            foreach ( $boxes as $box ) {
              $result[] = Array(
                "name"        => htmlspecialchars($box['name']),
                "delimiter"   => htmlspecialchars($box['delimiter']),
                "attributes"  => htmlspecialchars($box['attributes'])
              );
            }
          }
        } else if ( $action == "folder" ) {
          $fname    = (isset($args['fname'])    && ($args['folder']))   ? $args['folder'] : false;
          $iconview = (isset($args['iconview']) && ($args['iconview'])) ? true            : false;
          $filter   = (isset($args['filter'])   && ($args['filter']))   ? $args['filter'] : false;

          if ( $filter == "ALL" ) {
            if ( isset($args['account']['folders']) ) {
              if ( isset($args['account']['folders'][$fname]) ) {
                $last   = $args['account']['folders'][$fname];
                $stamp  = gmdate('d-M-Y G\:i', (((int) $last) - 300));
                $filter = sprintf('SINCE "%s"', $stamp);
              }
            }
          }

          //if ( $messages = $imap->getMessageHeaders() ) {
          if ( $messages = $imap->getMessages($filter) ) {

            if ( $iconview ) {
              $columns = Array(
                Array(
                  "className" => "Sender",
                  "style"     => null,
                  "title"     => "Sender"
                ),
                Array(
                  "className" => "Subject",
                  "style"     => null,
                  "title"     => "Subject"
                ),
                Array(
                  "className" => "Date",
                  "style"     => null,
                  "title"     => "Date"
                ),
                Array(
                  "className" => "Info",
                  "style"     => "display:none;",
                  "title"     => null
                )
              );

              $items = Array();
              $i = 0;

              foreach ( $messages as $msg ) {
                $msg['class']   = $i % 2 ? "odd" : "even";
                $msg['header']  = htmlspecialchars($msg['header']);
                $msg['sender']  = htmlspecialchars($msg['sender']);
                $msg['subject'] = htmlspecialchars($msg['subject']);

                $items[] = $msg;
                $i++;
              }

              $result = Array(
                "filter"  => $filter,
                "items"   => $items,
                "columns" => $columns
              );
            } else {
              $result = Array();
              foreach ( $messages as $msg ) {
                $result[] = Array(
                  "id"      => $msg['id'],
                  "date"    => $msg['date'],
                  "header"  => htmlspecialchars($msg['header']),
                  "sender"  => htmlspecialchars($msg['sender']),
                  "subject" => htmlspecialchars($msg['subject']),
                );
              }
            }
          }
        } else if ( ($action == "read") && isset($args['id']) ) {
          $result = $imap->read($args['id']);
        } else if ( $action == "send" ) {
          $result = $imap->send();
        }
      }


      /*
      print "Trying to '$action'\n\n";
      print "Errors: ";
      var_dump($imap->getErrors());
      print "Result: ";
      var_dump($result);
      print "\n";
       */
    } catch ( Exception $e ) {
      $result = $e->getMessage();
    }

    return $result;
  }

}

?>