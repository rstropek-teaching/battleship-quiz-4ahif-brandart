$(() => {
  // Select table containing the battleground
  const battleground = $('#battleground');

  // Build 10 x 10 grid for battleground
  for (let row = 0; row < 10; row++) {
    // Create table row
    const tr = $('<tr>');
    for (let column = 0; column < 10; column++) {
      // Create table cell with CSS class `water`. Note that we use
      // HTML data attributes  to store the coordinates of each cell
      // (see https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes). 
      // That makes it much easier to find cells based on coordinates later.
      $('<td>').addClass('water').attr('data-r', row).attr('data-c', column).appendTo(tr);
    }

    // Add table row to battleground table
    tr.appendTo(battleground);
  }

  $('#generate').click(() => {
    //Adding 'Destroyer'
    gen(2);
    //Adding 'Submarine'
    gen(3);
    //Adding 'Cruiser'
    gen(3);
    //Adding 'Battleship'
    gen(4);
    //Adding 'Carrier'
    gen(5);
  });

  function generateCords(len){
    var infos = {};
    infos.len = len;
    do{
      infos.x = Math.floor(Math.random() * 10);
      infos.y = Math.floor(Math.random() * 10);
      if(Math.floor(Math.random() * 2) === 0){
        infos.dir = 'vertical';
        //I make it longer, to make the proving easier
        if(infos.x === 0){
          //I need this information for reseting the length
          infos.extra = 1;
          // Prefer ++ over `+= 1`
          infos.len += 1;
        }else if(infos.x + infos.len - 10 === 0){
          infos.extra = -1;
          infos.len += 1;
          infos.x = -1;
        }else{
          infos.extra = 0;
          infos.x -= 1;
          infos.len += 2;
        }
      }else{
        infos.dir = 'horicontal';
        if(infos.y === 0){
          infos.extra = 1;
          infos.len += 1;
        }else if(infos.y + infos.len - 10 === 0){
          infos.extra = -1;
          infos.len += 1;
          infos.y = -1;
        }else{
          infos.extra = 0;
          infos.y -= 1;
          infos.len += 2;
        }
      }

    }
    // Prefer `while(!outOfBounds(infos))` instead of `=== false`
    while(outOfBounds(infos) === false);
    return infos;
  }

  function proveSet(x,y){
    return $(`td[data-r="${x}"][data-c="${y}"]`).hasClass('ship');
  }

  function proveOverlaping(infos){
    for(i = 0; i < infos.len; i++){
      if(infos.dir === 'vertical'){
        if(proveSet(infos.x + i, infos.y) || proveSet(infos.x + i, infos.y - 1) || proveSet(infos.x + i, infos.y + 1)){
          return false;
        }
      }else{
        if(proveSet(infos.x, infos.y + i) || proveSet(infos.x - 1, infos.y + i) || proveSet(infos.x + 1, infos.y + i)){
          return false;
        }
      }
    }
  }

  function outOfBounds(infos){
    if(infos.dir === 'vertical'){
      if(infos.len + infos.x - 10 > 0){
        return false;
      }
    }else{
      if(infos.len + infos.y - 10 > 0){
        return false;
      }
    }
    return true;
  }

  function gen(len){
    do{
       infos = generateCords(len);
    }while(proveOverlaping(infos) === false);

    if(infos.dir === 'vertical'){
      //now I reset the length to the original one
      if(infos.extra === true){
        infos.len -= 1;
      }else if(infos.extra === -1){
        infos.len -= 1;
        infos.x += 1;
      }else{
        infos.x += 1;
        infos.len -= 2;
      }
      
    }else{
      if(infos.extra === 1){
        infos.len -= 1;
      }else if(infos.extra === -1){
        infos.len -= 1;
        infos.y += 1;
      }else{
        infos.y += 1;
        infos.len -= 2;
      }
      
    }
    for(i = 0; i < len; i++ ){
      if(infos.dir === 'vertical'){
        $(`td[data-r="${i + infos.x}"][data-c="${infos.y}"]`).removeClass('water').addClass('ship');
      }else{
        $(`td[data-r="${infos.x}"][data-c="${i + infos.y}"]`).removeClass('water').addClass('ship');
      }
    }
  }
});

