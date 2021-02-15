function swap(items, leftIndex, rightIndex){
    var temp = items[leftIndex]
    items[leftIndex] = items[rightIndex]
    items[rightIndex] = temp
}

function partition(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)].valueOf(), //middle element
        i       = left, //left pointer
        j       = right //right pointer
    while (i <= j) {
        while (items[i]['fantasy-land/lte'](pivot) && !items[i]['fantasy-land/equals'](pivot)) {
            i++
        }
        while (!items[j]['fantasy-land/lte'](pivot)) {
            j--
        }
        if (i <= j) {
            swap(items, i, j) //sawpping two elements
            i++
            j--
        }
    }
    return i
}

export function quickSort(items) {
  const impl = (items, left, right) => {
    var index
    if (items.length > 1) {
        index = partition(items, left, right) //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            impl(items, left, index - 1)
        }
        if (index < right) { //more elements on the right side of the pivot
            impl(items, index, right)
        }
    }
    return items
  }

  return impl(items, 0, items.length - 1)
}
