const note_container = document.getElementById('app');

// select first ".add-note" from note_continer
const add_note_button = note_container.querySelector(".add-note");

// localStorage.setItem("sticky_notes_storage", JSON.stringify( { "id": 1, "content": "Test Message"} ) );

// Step 1: when the page first loads up... show currently exiested notes 

// F_get_notes().forEach( note => {
//     const note_element = F_create_note_element( note.id, note.content );    // note is comming from local storage...
//     note_container.insertBefore( note_element, add_note_button );      // before "add button " add the the note
// });

const array_notes = F_get_notes();
for ( var i = 0; i < array_notes.length; i++ ){
    const note = array_notes[i];
    const note_element = F_create_note_element( note.id, note.content );    // note is coming from local storage...
    note_container.insertBefore( note_element, add_note_button );      // before "add button " add the the note
}



// 
add_note_button.addEventListener("click", () => F_add_note() );


// get the stored data from local or create new empty one
function F_get_notes() {
  const storedNotes = localStorage.getItem("sticky_notes_storage");
  if (storedNotes === null) {
    return [];
  }
  return JSON.parse(storedNotes);
}


function F_save_note( array_of_notes ){
    localStorage.setItem("sticky_notes_storage", JSON.stringify( array_of_notes ) );
    // JSON.stringify converts string into json 
}


function F_create_note_element( id, content ){
    const ele_textarea = document.createElement("textarea");

    ele_textarea.classList.add("note");
    ele_textarea.value = content;
    ele_textarea.placeholder = "Empty Sticky Note.";

    // when user changes any text , update
    ele_textarea.addEventListener("change", () => {
        F_update_note( id, ele_textarea.value );
    });


    // double click on notes to delete
    ele_textarea.addEventListener("dblclick", () => {
        const do_delete = confirm("Are You Sure, About Selete This Note ?\n \n Refresh The Page After Ok, \n\n To see The Changes.");

        if( do_delete ){
            F_delete_note( id );
            
        }
        
    });
    
    return ele_textarea;
}


function F_add_note(){
    // get existing notes first from local storage
    const notes = F_get_notes();

    const note_obj = {
        id: Math.floor( Math.random() * 1000 ),
        content: ""
    };

    const note_element = F_create_note_element( note_obj.id, note_obj.content );
    note_container.insertBefore( note_element, add_note_button );

    notes.push( note_obj );
    F_save_note( notes );
}



function F_update_note( id, new_content ) {

    const notes = F_get_notes();
    const target_note = notes.filter( note => note.id == id)[0];    // it returns array of single too, that's why 0 to select 

    target_note.content = new_content;

    F_save_note( notes );
    
    console.log("Updating... Note...");
    console.log( id, new_content );

}


function F_delete_note( id, element ){
    location.reload();

    const notes = F_get_notes().filter( note => note.id != id );

    F_save_note( notes );

    note_container.removeChild( element );

    console.log("Deleting Note...");
    console.log(id);
    
}
