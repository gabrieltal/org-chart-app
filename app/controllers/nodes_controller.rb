class NodesController < ApplicationController
  def index
    all_nodes = Node.all
    respond_to do |format|
      format.html { render html: "There are #{all_nodes.count} nodes" }
      format.json { render json: all_nodes }
    end
  end

  def update
    node = Node.find(params[:id])

    if node.update(node_params)
      respond_to do |format|
        format.html { render html: "Updated node #{node.id}" }
        format.json { render json: Node.all }
      end
    else
      respond_to do |format|
        format.html { render html: "Couldn't update node #{node.errors}" }
        format.json { render json: "Couldn't update node #{node.errors}" }
      end
    end
  end

  private

  def node_params
    params.require(:node).permit(:parent_id)
  end
end
