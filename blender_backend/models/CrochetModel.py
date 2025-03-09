from .CrochetStitch import Row, Chain, SingleCrochet, SlipStitch, DoubleCrochet, HalfDouble, VerticalChain
import bpy
import os
import time
import copy

class CrochetModel:
    # use method to add

    def __init__(self):
        self.row_amount = 0
        self.cur_row = Row()
        self.rows = []
        self.model_dict = {"Single": SingleCrochet, "Chain": Chain, "Double": DoubleCrochet, "Slip": SlipStitch, "Half-Double": HalfDouble}
        self.light = None
        self.init_scene()
        self.modified_objects = []
        self.history = []
        self.redo_stack = []
        self.build_count = 0
        self.max_length = float('inf')

    def init_scene(self):
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.context.scene.render.resolution_x = 708
        bpy.context.scene.render.resolution_y = 495
        cam = bpy.data.cameras.new("Camera 1")
        cam_obj = bpy.data.objects.new("Camera 1", cam)
        cam_obj.location = (0, 0, 0)
        cam_obj.rotation_euler = (-90 * 3.14159 / 180, 180* 3.14159 / 180,0)
        bpy.context.scene.collection.objects.link(cam_obj)
        bpy.context.scene.camera = cam_obj
        bpy.ops.object.light_add(type='POINT', location=(0, .5, .5))
        self.light = bpy.context.object
        bpy.context.scene.render.engine = 'BLENDER_WORKBENCH'
        bpy.ops.ed.undo_push(message="init")

    def get_camera_object(self):
        for obj in bpy.context.scene.objects:
            if obj.type == 'CAMERA':
                return obj

    def addToRow(self, type, amount, isRedo):
        self.modified_objects.clear()
        stitch = self.model_dict[type]
        if self.cur_row == None:
            self.newRow(isRedo)
        for n in range(0, amount):
            self.cur_row.add_stitch(stitch)
            self.modified_objects.append(self.cur_row.array_size-1) #index of modified stitch
        self.cur_row.add_to_tuples(stitch(), amount, self.modified_objects.copy())
        self.build()
        action = {"type": "add_to_row", "param": (type, amount)}
        if not isRedo:
            self._add_to_history(action)

    def newRow(self, isRedo):
        if self.cur_row.array_size and self.cur_row.get_array_size() > 0:
            next_row_turned = False
            if self.cur_row.get_row_turned() == False:
                next_row_turned = True
            if self.cur_row not in self.rows:  # Ensure the undone row isn't added again
                self.rows.append(self.cur_row)
            self.max_length = self.rows[-1].get_array_size()
            self.cur_row = Row()
            self.cur_row.set_row_turned(next_row_turned)
            self.row_amount += 1
            action = {"type": "new_row"}
            if not isRedo:
                self._add_to_history(action)
        for row in self.rows:
            print(row.stitch_array)

    def addStitch(self, type):
        self.cur_row.add_stitch(type)

    def clearPattern(self):
        try:
            print("🔄 Clearing pattern...")

            # Preserve Camera and Lighting before clearing
            camera = self.get_camera_object()
            existing_light = None
            for obj in bpy.context.scene.objects:
                if obj.type == 'LIGHT':
                    existing_light = obj
                    break  # Preserve first found light

            # Reset Variables
            self.row_amount = 0
            self.rows = []
            self.cur_row = Row()
            self.history = []
            self.redo_stack = []
            self.max_length = float("inf")

            # ✅ **Wait before clearing scene**
            import time
            print("⏳ Waiting before clearing pattern objects...")
            time.sleep(0.5)  # Let Blender process previous changes

            # ✅ **Properly Delete Only Pattern Objects**
            print("🧹 Deleting pattern-related objects...")
            objects_to_delete = [obj for obj in bpy.data.objects if obj.type not in ["CAMERA", "LIGHT"]]
            for obj in objects_to_delete:
                try:
                    bpy.data.objects.remove(obj, do_unlink=True)
                except Exception as e:
                    print(f"⚠️ Warning: Could not delete object {obj.name}: {e}")

            # ✅ **Rebuild the Pattern**
            print("🔄 Rebuilding pattern...")
            self.modified_objects.clear()

            # 🚀 **Manually re-add all rows after undo**
            if self.rows:
                self.cur_row = self.rows[-1]
            else:
                self.cur_row = Row()

            # Add an initial row and force rebuild
            print("➕ Adding an initial row...")
            self.newRow(isRedo=False)
            self.build()  # **Forces visualization update**
    

            # ✅ **Adjust Camera**
            print("📷 Adjusting camera...")
            camera = None
            for obj in bpy.data.objects:
                if obj.type == "CAMERA":
                    camera = obj
                    break

            if camera:
                cam_dist = max(self.get_max_length() * 2, 2)
                camera.location = (self.get_max_length() / 2, cam_dist, self.get_max_length() / 4)
                print("✅ Camera adjusted.")
        

            # ✅ **Regenerate PNG & Pattern**
            print("📸 Saving new pattern...")
            self.save_png()
            self.generate_written_pattern()
            print("✅ Scene reset while keeping camera/light settings.")

            print("✅ Pattern cleared successfully.")
            return {"row_count": 1, "stitch_count": 0, "stitch_options": ["Chain"]}

        except Exception as e:
            print(f"❌ Error clearing pattern: {e}")
            return {"error": str(e)}



    def build(self):
        new_z = 0
        all_rows = self.rows + [self.cur_row]
        new_x = 0
        max_length = 0
        last_stitch = None
        last_row = None

        for index, row in enumerate(all_rows):
            length = row.get_array_size() * .01
            if length > max_length:
                max_length = length

            if index == len(all_rows) - 1:  # If at cur_row
                turned = row.get_row_turned()
                stitch_tuples = row.get_tuples()
                new_x = 0
                if turned and last_row and last_row.get_array_size() > 0:
                    new_x = last_row.get_array_size() * .01 + .01

                for tpl_idx, tpl in enumerate(stitch_tuples):
                    stitch, count = tpl
                    if tpl_idx == len(stitch_tuples) - 1:  # If it is the modified stitch
                        if turned:
                            stitch.set_turned()
                        model = stitch.get_model()
                        if model:
                            model.location = (new_x, 0, new_z)
                            array_modifier = model.modifiers.new(name="Array", type='ARRAY')
                            array_modifier.count = count 
                            array_modifier.use_relative_offset = True
                            array_modifier.relative_offset_displace[0] = 0.5

                            pos_z = new_z
                            if last_stitch is None and last_row and last_row.get_tuples():
                                pos_z -= last_row.get_max_height()
                                last_stitch = last_row.get_tuples()[-1][0]  # **Ensure last_row has tuples**
                                num_vert = last_stitch.get_turning_num()

                                if num_vert > 0:
                                    vert_x = 0
                                    vertical_chain = VerticalChain()
                                    if turned and last_row.get_array_size() > 0:
                                        vert_x = last_row.get_array_size() * .01 + .01

                                    vert_model = vertical_chain.get_model()
                                    vert_model.location = (vert_x, 0, pos_z)
                                    array_mod = vert_model.modifiers.new(name="Array", type='ARRAY')
                                    array_mod.count = num_vert
                                    array_mod.use_constant_offset = True
                                    array_mod.constant_offset_displace[2] = .01

                    last_stitch = stitch
                    new_x += .01 * count if not turned else -(.01 * count)

            else:
                last_row = row if row.get_tuples() else None  # **Ensure last_row is valid**
            new_z += row.get_max_height() * .9 if row.get_tuples() else 0  # **Prevent errors on empty rows**

        # Adjust camera position
        if new_z == 0:
            new_z = .001

        camera = self.get_camera_object()
        cam_dist = max_length * 2 + new_z if max_length > new_z else new_z * 2 + max_length
        camera.location = (max_length / 2, cam_dist + new_z, new_z / 2)

        self.save_png()
        self.build_count += 1
        self.generate_written_pattern()


    def save_png(self):
        output_blend_file_path = os.getcwd() + "/models/assets/new_pattern.blend"
        png_file_path = os.getcwd() + "/models/assets/model.png"
        # Ensure directory exists
        os.makedirs(os.path.dirname(png_file_path), exist_ok=True)
        bpy.context.scene.render.image_settings.file_format = 'PNG'
        bpy.context.scene.render.filepath = png_file_path
        bpy.ops.render.render(write_still=True)
        bpy.ops.wm.save_as_mainfile(filepath=output_blend_file_path)

    def generate_written_pattern(self):
        written_pattern = []
        string_list = []
        row_num = 1
        all_rows = self.rows + [self.cur_row]

        if not all_rows:
            return ""  # Return empty pattern if no rows exist

        first_row = all_rows[0]
        last_row = all_rows[-1]

        for idx, row in enumerate(all_rows):
            if row.get_array_size() != 0:
                row_string = ""
                if row != first_row:
                    first_stitch = row.get_tuples()[0][0] if row.get_tuples() else None
                    if first_stitch:
                        row_string += first_stitch.to_string_from_stitch()

                row_string += f'{row.to_string()}'
                if row != last_row:
                    next_row = all_rows[idx + 1]
                    if next_row.get_array_size() != 0 and next_row.get_tuples():
                        next_stitch = next_row.get_tuples()[0][0]  # **Check before accessing**
                        row_string += f", {next_stitch.to_string_turning()}"
            
                row_num += 1
                row_string += "\n"
                string_list.append(row_string)

        repeat_rows = []
        for row_num, row in enumerate(string_list):
            if row_num != len(string_list) - 1:  # If it's not the last one
                next_row = string_list[row_num + 1]
                if next_row == row:
                    repeat_rows.append(row_num)
                elif next_row and repeat_rows:
                    num_string = f'Row {repeat_rows[0] + 1}-{row_num + 1}: '
                    written_pattern.append(num_string + row)
                    repeat_rows = []
                else:
                    num_string = f'Row {row_num + 1}: '
                    written_pattern.append(num_string + row)
            else:
                num_string = f'Row {row_num + 1}: '
                written_pattern.append(num_string + row)

        written_pattern = "".join(written_pattern)
        return written_pattern


    def redo(self):
        if not self.redo_stack:
            print("🛑 No actions to redo.")
            return
    
        action = self.redo_stack.pop()
        self.history.append(action)  # Move back to history stack

        if action["type"] == "add_to_row":
            type, amount = action["param"]
            self.addToRow(type, amount, isRedo=True)
        elif action["type"] == "new_row":
            self.newRow(isRedo=True)

        self.build()  # Rebuild after redo
        print("✅ Redo successful!")


    def _add_to_history(self, action):
        # Store previous state before adding action
        state = {
        "cur_row": copy.deepcopy(self.cur_row),
        "row_amount": self.row_amount ,
        "rows": copy.deepcopy(self.rows)
        }
    
        action["state"] = state  # Store previous state in action history
        self.history.append(action)
        self.redo_stack = []  # Clear redo stack when a new action is performed


    def undo(self): 
        if not self.history:
            print("🛑 No actions to undo.")
            return {"message": "No actions to undo."}

        action = self.history.pop()
        self.redo_stack.append(action)  # Move action to redo stack for future redo

        
        if len(self.history) > 0:
            prev_action = self.history[len(self.history) - 1]
            if action["type"] == "add_to_row" and prev_action["type"] == "new_row":
                self.history.pop()
            # Restore previous state correctly
            prev_state = self.history[len(self.history) - 1]["state"]
            self.cur_row = copy.deepcopy(prev_state["cur_row"])
            self.rows = copy.deepcopy(prev_state["rows"])  # Restore all rows!
            self.row_amount = prev_state["row_amount"]
            self.max_length = prev_state.get("max_length", float("inf"))  # Ensure max_length is restored

            # ✅ Ensure all rows are visible in the scene
            print(f"📝 Restored {len(self.rows)} rows and {self.cur_row.get_array_size()} stitches in current row.")

        else:
            # If history is empty, reset to default state
            print("⚠️ No previous state found, resetting to empty pattern.")
            self.cur_row = Row()
            self.rows = []
            self.row_amount = 0
            self.max_length = float("inf")
        
        print(f"📝 Rows after undo: {len(self.rows)}")

        # ✅ **Wait before clearing scene**
        import time
        print("⏳ Waiting before clearing pattern objects...")
        time.sleep(0.5)  # Let Blender process previous changes

        # ✅ **Properly Delete Only Pattern Objects**
        print("🧹 Deleting pattern-related objects...")
        objects_to_delete = [obj for obj in bpy.data.objects if obj.type not in ["CAMERA", "LIGHT"]]
        for obj in objects_to_delete:
            try:
                bpy.data.objects.remove(obj, do_unlink=True)
            except Exception as e:
                print(f"⚠️ Warning: Could not delete object {obj.name}: {e}")

        # ✅ **Rebuild the Pattern**
        print("🔄 Rebuilding pattern...")
        self.modified_objects.clear()

        # 🚀 **Manually re-add all rows after undo**
        if self.rows:
            self.cur_row = self.rows[-1]
        else:
            self.cur_row = Row()
     

        self.build()

        # ✅ **Adjust Camera**
        print("📷 Adjusting camera...")
        camera = None
        for obj in bpy.data.objects:
            if obj.type == "CAMERA":
                camera = obj
                break

        if camera:
            cam_dist = max(self.get_max_length() * 2, 2)
            camera.location = (self.get_max_length() / 2, cam_dist, self.get_max_length() / 4)
            print("✅ Camera adjusted.")
        

        # ✅ **Regenerate PNG & Pattern**
        print("📸 Saving new pattern...")
        self.save_png()
        self.generate_written_pattern()
        print("✅ Undo successful!")

        return {
            "message": "Undo successful.",
            "row_count": self.get_row_count(),
            "stitch_count": self.get_stitch_count(),
            "stitch_options": ["Single", "Double", "Half-Double", "Slip"] if self.get_row_count() > 1 else ["Chain"]
        }




       
    def get_stitch_count(self):
        count = 0
        for row in self.rows:
            count += row.get_array_size()
        count += self.cur_row.get_array_size()
        return count

    def get_row_count(self):
        count = len(self.rows) + 1
        return count

    def get_max_length(self):
        return self.max_length